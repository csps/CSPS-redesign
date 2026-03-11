import React, { useState, useRef, useMemo } from "react";
import { bulkCreateMemberships } from "../../../../api/studentMembership";
import type { StudentMembershipResponse } from "../../../../interfaces/student/StudentMembership";

interface BulkMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: StudentMembershipResponse[]) => void;
}

interface StudentEntry {
  id: string;
  studentId: string;
}

/**
 * Parse CSV text and extract student IDs
 * Supports flexible header names: "student id", "studentid", "id", "student_id"
 */
const parseCsv = (csvText: string): string[] => {
  const lines = csvText.trim().split("\n");

  if (lines.length < 2) {
    throw new Error("CSV must have a header row and at least one data row");
  }

  // Parse header (case-insensitive)
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  // Find Student ID column
  const idIndex = headers.findIndex((h) =>
    ["student id", "studentid", "id", "student_id"].includes(h),
  );

  if (idIndex === -1) {
    throw new Error(
      'CSV must contain a "Student ID" column (or variants: studentid, id, student_id)',
    );
  }

  // Extract and filter student IDs
  const studentIds = lines
    .slice(1)
    .map((line) => {
      const cells = line.split(",");
      return cells[idIndex]?.trim() || "";
    })
    .filter((id) => id.length > 0);

  // Deduplicate
  return [...new Set(studentIds)];
};

const getCurrentAcademicYear = (): { start: number; end: number } => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Assume academic year starts in August (month 7)
  if (month >= 7) {
    return { start: year, end: year + 1 };
  } else {
    return { start: year - 1, end: year };
  }
};

const BulkMembershipModal: React.FC<BulkMembershipModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [entries, setEntries] = useState<StudentEntry[]>([]);
  const [yearStart, setYearStart] = useState<number>(2025);
  const [yearEnd, setYearEnd] = useState<number>(2026);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentYear = useMemo(() => getCurrentAcademicYear(), []);

  const validEntries = entries.filter((e) => e.studentId.trim().length > 0);

  // Auto-update yearEnd when yearStart changes
  const handleYearStartChange = (newStart: number) => {
    setYearStart(newStart);
    setYearEnd(newStart + 1);
  };

  const handleCsvImport = (file: File) => {
    setCsvError(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const studentIds = parseCsv(text);

        if (studentIds.length === 0) {
          setCsvError("No valid student entries found in CSV");
          return;
        }

        const newEntries: StudentEntry[] = studentIds.map((id) => ({
          id: crypto.randomUUID(),
          studentId: id,
        }));

        setEntries(newEntries);
        setCsvError(null);
      } catch (err) {
        setCsvError(err instanceof Error ? err.message : "Failed to parse CSV");
      }
    };

    reader.onerror = () => {
      setCsvError("Failed to read file");
    };

    reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".csv")) {
      handleCsvImport(file);
    } else if (file) {
      setCsvError("Please select a valid CSV file");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    const file = files?.[0];
    if (file && file.name.endsWith(".csv")) {
      handleCsvImport(file);
    } else if (file) {
      setCsvError("Please drop a valid CSV file");
    }
  };

  const downloadTemplate = () => {
    const csvContent = [
      "Student ID",
      "21100001",
      "21100002",
      "21100003",
      "21100004",
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bulk_membership_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddManual = () => {
    if (inputValue.trim()) {
      const newEntry: StudentEntry = {
        id: crypto.randomUUID(),
        studentId: inputValue.trim(),
      };
      setEntries((prev) => [...prev, newEntry]);
      setInputValue("");
    }
  };

  const handlePasteIds = () => {
    const ids = inputValue
      .split(/[,\s\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (ids.length > 0) {
      const newEntries: StudentEntry[] = ids.map((id) => ({
        id: crypto.randomUUID(),
        studentId: id,
      }));
      setEntries((prev) => [...prev, ...newEntries]);
      setInputValue("");
    }
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSubmit = async () => {
    if (validEntries.length === 0) return;

    setIsLoading(true);
    try {
      const result = await bulkCreateMemberships({
        studentIds: validEntries.map((e) => e.studentId),
        yearStart,
        yearEnd,
      });

      const message =
        result.length < validEntries.length
          ? `Created ${result.length} of ${validEntries.length} memberships`
          : `Created ${result.length} memberships for ${yearStart}-${yearEnd}`;

      // Show success toast or notification
      console.log(message);
      onSuccess(result);
      handleClose();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to create memberships";
      setCsvError(errorMsg);
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  const handleClose = () => {
    setEntries([]);
    setInputValue("");
    setCsvError(null);
    setShowConfirm(false);
    onClose();
  };

  const isCurrentYear = yearStart === currentYear.start;
  const canSubmit = validEntries.length > 0 && yearStart < yearEnd;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1E1E3F] border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Add Membership</h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Academic Year Selection */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 tracking-wide uppercase mb-2">
                Academic Year
              </label>
              <div className="flex gap-2">
                <select
                  value={yearStart}
                  onChange={(e) =>
                    handleYearStartChange(Number(e.target.value))
                  }
                  disabled={isLoading}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 px-3 py-2.5 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer appearance-none disabled:opacity-50"
                >
                  <option value={2024}>2024-2025</option>
                  <option value={2025}>2025-2026</option>
                  <option value={2026}>2026-2027</option>
                  <option value={2027}>2027-2028</option>
                </select>
                <div className="flex items-center px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-400">
                  {yearStart} – {yearEnd}
                </div>
              </div>
              {isCurrentYear && (
                <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
                  Current academic year
                </p>
              )}
            </div>

            {/* CSV Import Section */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-purple-300">
                    Import from CSV
                  </span>
                </div>
                <button
                  onClick={downloadTemplate}
                  disabled={isLoading}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors disabled:opacity-50"
                  title="Download CSV template"
                >
                  Download Template
                </button>
              </div>

              {csvError && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2">
                  <p className="text-xs text-red-400">{csvError}</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                disabled={isLoading}
                className="hidden"
              />
              <div
                onClick={() => !isLoading && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex items-center justify-center gap-2 w-full px-3 py-4 border-2 border-dashed rounded-lg transition-all ${
                  isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                } ${
                  isDragOver
                    ? "border-purple-500/80 bg-purple-500/20"
                    : "border-purple-500/40 bg-purple-500/5 hover:border-purple-500/60 hover:bg-purple-500/10"
                }`}
              >
                <svg
                  className="w-4 h-4 text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16v-4m0 0V8m0 4H8m4 0h4M4 20h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
                  />
                </svg>
                <span
                  className={`transition-colors ${
                    isDragOver
                      ? "text-purple-200"
                      : "text-purple-300 hover:text-purple-200"
                  }`}
                >
                  {isDragOver
                    ? "Drop CSV file here"
                    : "Click to upload or drag CSV file"}
                </span>
              </div>
              <p className="text-xs text-purple-400/70 text-center">
                CSV should have a "Student ID" column
              </p>
            </div>

            {/* Manual Entry Section */}
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 space-y-3">
              <label className="text-xs font-medium text-zinc-500 tracking-wide uppercase">
                Add Manually or Paste IDs
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddManual();
                  }}
                  placeholder="Paste comma-separated IDs or type one ID"
                  disabled={isLoading}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 px-3 py-2 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handlePasteIds}
                    disabled={!inputValue.trim() || isLoading}
                    className="flex-1 sm:flex-none px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Paste
                  </button>
                  <button
                    onClick={handleAddManual}
                    disabled={!inputValue.trim() || isLoading}
                    className="flex-1 sm:flex-none px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
              <p className="text-xs text-zinc-600">
                Enter single IDs and press Add, or paste multiple
                comma-separated IDs and click Paste
              </p>
            </div>

            {/* Entry List */}
            {entries.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-zinc-500 tracking-wide uppercase">
                    Student IDs ({validEntries.length})
                  </label>
                  <button
                    onClick={() => setEntries([])}
                    disabled={isLoading}
                    className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors disabled:opacity-50"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {entries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-2"
                    >
                      <span className="text-xs text-zinc-600 w-6 text-center font-medium">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm text-zinc-200">
                        {entry.studentId}
                      </span>
                      <button
                        onClick={() => removeEntry(entry.id)}
                        disabled={isLoading}
                        className="p-1 text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
            {/* Summary */}
            {validEntries.length > 0 && (
              <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Students to enroll:</span>
                  <span className="text-white font-medium">
                    {validEntries.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Academic Year:</span>
                  <span className="text-white font-medium">
                    {yearStart}–{yearEnd}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t border-zinc-700/50 pt-2">
                  <span className="text-zinc-500">Status:</span>
                  <span
                    className={`font-medium ${
                      isCurrentYear ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {isCurrentYear ? "ACTIVE ✓" : "INACTIVE"}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 border border-zinc-700 text-zinc-300 hover:text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={!canSubmit || isLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>

          {/* Confirmation Overlay */}
          {showConfirm && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center p-6">
              <div className="bg-[#1E1E3F] border border-zinc-800 rounded-xl p-6 max-w-sm w-full space-y-4">
                <h3 className="text-lg font-semibold text-white">Confirm</h3>
                <p className="text-sm text-zinc-400">
                  You are about to enroll{" "}
                  <span className="text-white font-medium">
                    {validEntries.length}
                  </span>{" "}
                  student{validEntries.length !== 1 ? "s" : ""} in the{" "}
                  <span className="text-purple-400 font-medium">
                    {yearStart}–{yearEnd}
                  </span>{" "}
                  membership.
                </p>
                <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Students</span>
                    <span className="text-white font-medium">
                      {validEntries.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Year</span>
                    <span className="text-white font-medium">
                      {yearStart}–{yearEnd}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-zinc-700/50 pt-2">
                    <span className="text-zinc-500">Status</span>
                    <span
                      className={`font-semibold ${
                        isCurrentYear ? "text-green-400" : "text-yellow-400"
                      }`}
                    >
                      {isCurrentYear ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isLoading}
                    className="flex-1 border border-zinc-700 text-zinc-400 hover:text-zinc-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Confirm"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BulkMembershipModal;
