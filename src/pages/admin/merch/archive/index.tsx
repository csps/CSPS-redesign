import { useState, useEffect } from "react";
import { getArchivedMerch, revertMerch } from "../../../../api/merch";
import MerchTable from "../components/MerchTable";
import Pagination from "../../../../components/Pagination";
import AuthenticatedNav from "../../../../components/AuthenticatedNav";
import Layout from "../../../../components/Layout";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { usePermissions } from "../../../../hooks/usePermissions";

export default function ArchivedMerchandise() {
  const [archivedItems, setArchivedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { canManageMerch } = usePermissions();

  useEffect(() => {
    fetchArchivedMerch();
  }, [currentPage, pageSize]);

  const fetchArchivedMerch = async () => {
    try {
      setLoading(true);
      const data = await getArchivedMerch(currentPage, pageSize);
      setArchivedItems(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch archived merchandise");
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async (merchId: number) => {
    if (
      !confirm(
        "Are you sure you want to revert this merchandise to active status?",
      )
    ) {
      return;
    }

    try {
      await revertMerch(merchId);
      toast.success("Merchandise reverted successfully!");
      fetchArchivedMerch(); // Refresh the list
    } catch (err: any) {
      toast.error(err.message || "Failed to revert merchandise");
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Reset to first page
  };

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AuthenticatedNav />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-12 mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/merch/products"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Archived Merchandise
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#1E1E3F]/20 border border-white/5 rounded-2xl p-6 min-h-[400px]">
          {loading ? (
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#1E1E3F] text-xs uppercase text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">ID</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Type</th>
                    <th scope="col" className="px-6 py-3">Price</th>
                    <th scope="col" className="px-6 py-3">Variants</th>
                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#1E1E3F]/40">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-8"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-white/10 rounded-md w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-8"></div></td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-8 bg-white/10 rounded-lg w-16 ml-auto"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : archivedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-gray-400 text-lg mb-2">
                No archived merchandise found.
              </p>
              <p className="text-gray-500 text-sm">
                Archived items will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
                <span>Total: {totalElements} items</span>
                <div className="flex items-center gap-2">
                  <label htmlFor="pageSize">Items per page:</label>
                  <select
                    id="pageSize"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="bg-[#1E1E3F] border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              <MerchTable
                items={archivedItems}
                onRevert={canManageMerch ? handleRevert : undefined}
                showRevertButton={canManageMerch}
              />

              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
