import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { checkInToSession } from "../../../../../api/eventParticipation";
import type { AttendanceRecordResponse } from "../../../../../interfaces/event/AttendanceRecordResponse";

interface QRScannerModalProps {
  sessionId: number;
  sessionName: string;
  onClose: () => void;
  onCheckedIn: (record: AttendanceRecordResponse) => void;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({
  sessionId,
  sessionName,
  onClose,
  onCheckedIn,
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
    record?: AttendanceRecordResponse;
  } | null>(null);

  const READER_ID = "admin-qr-reader";

  // start scanner
  useEffect(() => {
    let mounted = true;
    let scanner: Html5Qrcode | null = null;

    const startScanner = async () => {
      // delay to ensure the DOM element exists
      await new Promise((r) => setTimeout(r, 300));
      if (!mounted) return;

      // clear any leftover DOM content from a previous instance
      const container = document.getElementById(READER_ID);
      if (container) container.innerHTML = "";

      scanner = new Html5Qrcode(READER_ID);
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 20,
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
              const minDim = Math.min(viewfinderWidth, viewfinderHeight);
              const size = Math.floor(minDim * 0.8);
              return { width: size, height: size };
            },
          },
          (decodedText) => {
            if (!mounted || processingRef.current) return;
            handleScan(decodedText);
          },
          () => {},
        );
        if (mounted) setScanning(true);
      } catch {
        if (mounted) {
          setResult({
            type: "error",
            message: "Camera access denied or unavailable",
          });
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      if (scanner) {
        try {
          if (scanner.isScanning) {
            scanner.stop().catch(() => {});
          }
        } catch {}
      }
      scannerRef.current = null;
    };
  }, []);

  const handleScan = async (rawValue: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setProcessing(true);
    setResult(null);

    const PREFIX = "https://csps.com/";

    const qrToken = rawValue.startsWith(PREFIX)
      ? rawValue.slice(PREFIX.length)
      : rawValue;

    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.pause();
      }
    } catch {}

    try {
      console.log("Checking in with QR token:", qrToken);
      const record = await checkInToSession(sessionId, qrToken);
      setResult({
        type: "success",
        message: `${record.studentName} checked in`,
        record,
      });
      onCheckedIn(record);
      setTimeout(() => resumeScanner(), 2000);
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Check-in failed. Invalid QR code.";
      setResult({ type: "error", message: msg });
      setTimeout(() => resumeScanner(), 2000);
    } finally {
      setProcessing(false);
    }
  };

  const resumeScanner = () => {
    setResult(null);
    processingRef.current = false;
    try {
      if (scannerRef.current) {
        scannerRef.current.resume();
      }
    } catch {}
  };

  const handleClose = async () => {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
      }
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[#170657] border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3">
          <div>
            <h2 className="text-base font-bold text-white">Scan QR Code</h2>
            <p className="text-white/40 text-xs mt-0.5">{sessionName}</p>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* scanner viewport */}
        <div className="px-6 pb-4">
          <div className="relative rounded-xl overflow-hidden bg-black border border-white/10">
            <div id={READER_ID} className="w-full" />
            {!scanning && !result && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* result feedback */}
        {result && (
          <div className="px-6 pb-4">
            <div
              className={`rounded-xl p-4 flex items-center gap-3 ${
                result.type === "success"
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-red-500/10 border border-red-500/20"
              }`}
            >
              {result.type === "success" ? (
                <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
              <div className="min-w-0">
                <p
                  className={`text-sm font-medium ${
                    result.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {result.message}
                </p>
                {result.record && (
                  <p className="text-[10px] text-white/30 mt-0.5">
                    {result.record.studentId}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* processing indicator */}
        {processing && (
          <div className="px-6 pb-4">
            <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
              <p className="text-white/50 text-sm">Processing...</p>
            </div>
          </div>
        )}

        {/* close button */}
        <div className="px-6 pb-6">
          <button
            onClick={handleClose}
            className="w-full py-3 bg-white/5 text-white/60 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;
