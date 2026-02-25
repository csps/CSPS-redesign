import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import RatioCards from "./components/RatioCards";
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
    <>
      <Layout>
        <AuthenticatedNav />
        <div className="p-6 space-y-6">
          {/* page header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1">
                ADMIN DASHBOARD
              </p>
              <h1 className="text-2xl font-bold text-white">
                Membership Dashboard
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Monitor membership status and student activity
              </p>
            </div>

            {/* Bulk Enroll Button */}
            {canEditFinance && (
              <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Add Member
              </button>
            )}
          </div>

          {/* ratio cards + progress bar */}
          <RatioCards ratio={ratio} loading={ratioLoading} />

          {/* main content — 2-column layout on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* member tables take 2/3 */}
            <div className="lg:col-span-2">
              <MemberTabs
                refreshTrigger={refreshTrigger}
                canEditFinance={canEditFinance}
              />
            </div>
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
      </Layout>
    </>
  );
};

export default MembershipDashboardPage;
