import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import StaffTable from "./components/StaffTable";
import GrantAccessModal from "./components/GrantAccessModal";
import { getAllAdmins, revokeAdminAccess } from "../../../api/admin";
import type { AdminResponseDTO } from "../../../api/admin";

const StaffPage = () => {
  const [admins, setAdmins] = useState<AdminResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await getAllAdmins();
      setAdmins(data);
    } catch (error) {
      console.error("Failed to fetch admins", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleRevoke = async (adminId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to revoke admin access? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      await revokeAdminAccess(adminId);
      // Refresh list
      fetchAdmins();
    } catch (err) {
      console.error("Failed to revoke access", err);
      alert("Failed to revoke access.");
    }
  };

  return (
    <Layout>
      <AuthenticatedNav />

      <div className="w-full max-w-[95rem] mx-auto pt-8 pb-20 px-6 space-y-8 relative">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Staff Management</h1>
            <p className="text-white/50 mt-1">Manage admin access and roles.</p>
          </div>

          <button
            onClick={() => setIsGrantModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#FDE006] hover:brightness-110 text-black text-sm font-semibold transition shadow-lg shadow-yellow-500/10"
          >
            Grant Admin Access
          </button>
        </div>

        {/* Content */}
        <div className="w-full">
          {loading ? (
            <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="w-full">
                <div className="border-b border-white/10 bg-white/5 h-12"></div>
                <div className="divide-y divide-white/5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-[88px] flex items-center px-5 gap-4 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-white/5 shrink-0"></div>
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="h-4 bg-white/5 rounded w-1/4"></div>
                        <div className="h-3 bg-white/5 rounded w-1/6"></div>
                      </div>
                      <div className="h-4 bg-white/5 rounded w-1/4"></div>
                      <div className="h-6 bg-white/5 rounded-full w-24"></div>
                      <div className="h-6 bg-white/5 rounded-lg w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <StaffTable admins={admins} onRevoke={handleRevoke} />
          )}
        </div>
      </div>

      {isGrantModalOpen && (
        <GrantAccessModal
          onClose={() => setIsGrantModalOpen(false)}
          onSuccess={() => fetchAdmins()}
        />
      )}
    </Layout>
  );
};

export default StaffPage;
