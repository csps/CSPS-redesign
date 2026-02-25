import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdOutlineClose } from "react-icons/md";
import { getAvailablePositions, grantAdminAccess } from "../../../../api/admin";
import type { AdminPosition } from "../../../../enums/AdminPosition";

interface GrantAccessModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const GrantAccessModal: React.FC<GrantAccessModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [studentId, setStudentId] = useState("");
  const [position, setPosition] = useState<AdminPosition | "">("");
  const [availablePositions, setAvailablePositions] = useState<AdminPosition[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const positions = await getAvailablePositions();
        setAvailablePositions(positions);
        if (positions.length > 0) {
          setPosition(positions[0]);
        }
      } catch (err) {
        console.error("Failed to fetch positions", err);
      }
    };
    fetchPositions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !position) return;

    setLoading(true);
    setError("");

    try {
      await grantAdminAccess(studentId, position as AdminPosition);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to grant access. Check Student ID."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#170657] border border-white/10 rounded-3xl p-6 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <MdOutlineClose size={24} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">
          Grant Admin Access
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Student ID
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors placeholder-white/20"
              placeholder="e.g. 2023-12345"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as AdminPosition)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors [&>option]:bg-[#170657]"
              required
            >
              {availablePositions.length === 0 && (
                <option value="" disabled>
                  Loading positions...
                </option>
              )}
              {availablePositions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !position}
              className="w-full bg-[#FDE006] text-black font-bold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Grant Access"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default GrantAccessModal;
