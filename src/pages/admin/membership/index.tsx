import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import MemberTabs from "./components/MemberTabs";
import BulkMembershipModal from "./components/BulkMembershipModal";
import { getMembershipRatio } from "../../../api/studentMembership";
import type { MembershipRatioResponse } from "../../../interfaces/student/MembershipRatioResponse";
import type { StudentMembershipResponse } from "../../../interfaces/student/StudentMembership";
import usePermissions from "../../../hooks/usePermissions";

/**
 * Admin Membership Dashboard page.
 * Shows at-a-glance membership ratio stats, progress bar,
 * tabbed member/non-member tables, and an eligibility checker widget.
 * CUD operations (Grant Membership) are restricted to ADMIN_FINANCE only.
 */
const MembershipDashboardPage = () => {
  const { canEditFinance } = usePermissions();

  // ratio state
  const [ratio, setRatio] = useState<MembershipRatioResponse | null>(null);
  const [ratioLoading, setRatioLoading] = useState(true);

  // bulk membership modal state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // load ratio on mount
  useEffect(() => {
    const loadRatio = async () => {
      try {
        setRatioLoading(true);
        const data = await getMembershipRatio();
        setRatio(data);
      } catch (err) {
        console.error("failed to load membership ratio:", err);
      } finally {
        setRatioLoading(false);
      }
    };

    loadRatio();
  }, [refreshTrigger]);

  const handleBulkMembershipSuccess = (result: StudentMembershipResponse[]) => {
    console.log(`Bulk membership created: ${result.length} entries`);
    setRefreshTrigger((prev) => prev + 1);
    setShowBulkModal(false);
  };

  return (
    <Layout>
      <div className="relative w-full max-w-[90rem] mx-auto px-4 md:px-8 py-6 text-white">
        <AuthenticatedNav />
        <div className="mt-8 space-y-8">
          {/* page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                ADMIN DASHBOARD
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                Membership Management
              </h1>
              <p className="text-white/50">
                Monitor membership status and enroll students
                {ratio && !ratioLoading && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
                    {ratio.memberPercentage.toFixed(1)}% Active Members
                  </span>
                )}
              </p>
            </div>

            {/* Bulk Enroll Button */}
            {canEditFinance && (
              <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#FDE006] hover:brightness-110 text-black rounded-xl text-sm font-bold transition-all whitespace-nowrap shadow-lg shadow-yellow-500/10 active:scale-95"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Member
              </button>
            )}
          </div>

          {/* main content */}
          <div className="w-full">
            <MemberTabs
              refreshTrigger={refreshTrigger}
              canEditFinance={canEditFinance}
            />
          </div>
        </div>

        {/* Bulk Membership Modal */}
        {showBulkModal && (
          <BulkMembershipModal
            isOpen={showBulkModal}
            onClose={() => setShowBulkModal(false)}
            onSuccess={handleBulkMembershipSuccess}
          />
        )}
      </div>
    </Layout>
  );
};

export default MembershipDashboardPage;
