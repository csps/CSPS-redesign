import React, { useState } from "react";
import { checkMembershipStatus } from "../../../../api/merchCustomer";

/**
 * Inline widget for admins to quickly check if a student
 * already has a MEMBERSHIP merch in their cart or pending orders.
 * Can be embedded in the Membership Dashboard as a sidebar card.
 *
 * @returns JSX element with student ID input, check button, and result badge
 */

const EligibilityChecker: React.FC = () => {
  const [studentId, setStudentId] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedId, setCheckedId] = useState<string>("");

  const handleCheck = async () => {
    if (!studentId.trim()) return;
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      const res = await checkMembershipStatus(studentId.trim());
      setResult(res.hasMembership);
      setCheckedId(studentId.trim());
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to check membership status."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCheck();
  };

  return (
    <div className="bg-[#1E1E3F] rounded-2xl border border-white/5 p-6">
      <h3 className="text-sm font-semibold text-white tracking-tight mb-4">
        Membership Eligibility Checker
      </h3>

      {/* input + button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter Student ID..."
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors"
        />
        <button
          onClick={handleCheck}
          disabled={!studentId.trim() || loading}
          className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {/* result */}
      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {result !== null && !error && (
        <div className="mt-4">
          {result ? (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-yellow-500/10 text-yellow-400 border-yellow-500/20 mb-2">
                Has Membership in Cart/Pending
              </span>
              <p className="text-xs text-zinc-500 mt-1">
                Student <span className="text-zinc-300">{checkedId}</span>{" "}
                already has a MEMBERSHIP item in their cart or a pending order.
              </p>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-green-500/10 text-green-400 border-green-500/20 mb-2">
                Eligible for Membership
              </span>
              <p className="text-xs text-zinc-500 mt-1">
                Student <span className="text-zinc-300">{checkedId}</span>{" "}
                does not have a membership item in cart or pending orders.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EligibilityChecker;
