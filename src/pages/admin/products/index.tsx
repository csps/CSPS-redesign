import { useEffect, useState } from "react";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import SAMPLE from "../../../assets/image 8.png";
import { IoMdAdd } from "react-icons/io";
import { FiEdit3, FiTrash2, FiEye, FiArchive } from "react-icons/fi";
import ProductModal from "./components/ProductModal";
import { MerchType } from "../../../enums/MerchType";
import type { MerchSummaryResponse } from "../../../interfaces/merch/MerchResponse";
import {
  getAllMerchWithoutVariants,
  getMerchByType,
  deleteMerch,
} from "../../../api/merch";
import { useNavigate, Link } from "react-router-dom";
import { S3_BASE_URL } from "../../../constant";
import Layout from "../../../components/Layout";
import DeleteConfirmationModal from "../merch/productView/components/DeleteConfirmationModal";
import { toast } from "sonner";
import { usePermissions } from "../../../hooks/usePermissions";
import CustomDropdown from "../../../components/CustomDropdown";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [merch, setMerch] = useState<MerchSummaryResponse[]>([]);
  const [activeTag, setActiveTag] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(false);
  const [stockFilter, setStockFilter] = useState<string>("All Status");

  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [merchToDelete, setMerchToDelete] =
    useState<MerchSummaryResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigator = useNavigate();
  const { canManageMerch } = usePermissions();

  const navigate = (merchId: number) => {
    navigator(`/admin/merch/${merchId}`);
  };

  const fetchMerch = async (type: string) => {
    setLoading(true);
    try {
      const data =
        type === "ALL"
          ? await getAllMerchWithoutVariants()
          : await getMerchByType(type as MerchType);
      setMerch(data);
    } catch (err) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerch(activeTag);
  }, [activeTag]);

  const handleDeleteClick = (item: MerchSummaryResponse) => {
    setMerchToDelete(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!merchToDelete) return;

    setIsDeleting(true);
    try {
      await deleteMerch(merchToDelete.merchId);
      toast.success(`"${merchToDelete.merchName}" deleted successfully!`);
      setShowDeleteModal(false);
      setMerchToDelete(null);
      // Refetch merch list
      await fetchMerch(activeTag);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to delete product";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const stockOptions = [
    { label: "All Stock Status", value: "All Status" },
    { label: "In Stock", value: "In Stock" },
    { label: "Out of Stock", value: "Out of Stock" },
  ];

  const categoryOptions = [
    { label: "All Categories", value: "ALL" },
    ...Object.entries(MerchType).map(([key, value]) => ({
      label: key.charAt(0) + key.slice(1).toLowerCase(),
      value: value,
    })),
  ];

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AuthenticatedNav />

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-12 mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Products Inventory
            </h1>
            {canManageMerch && (
              <div className="flex gap-3 w-full sm:w-auto">
                <Link
                  to="/admin/merch/archive"
                  className="flex items-center gap-2 bg-[#1E293B] border border-white/10 text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-all hover:bg-[#334155] active:scale-95 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <FiArchive className="text-lg sm:text-xl" />
                  <span>Archive</span>
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="cursor-pointer flex items-center gap-2 bg-[#FFB800] text-black px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-all hover:brightness-110 active:scale-95 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <IoMdAdd className="text-lg sm:text-xl" />
                  <span>Add Product</span>
                </button>
              </div>
            )}
          </div>

          {/* Filter Bar Section */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8 lg:mb-10 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search products by name or ID..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="w-full sm:w-56">
                <CustomDropdown
                  label="Stock Status"
                  options={stockOptions}
                  value={stockFilter}
                  onChange={setStockFilter}
                />
              </div>
              <div className="w-full sm:w-56">
                <CustomDropdown
                  label="Category"
                  options={categoryOptions}
                  value={activeTag}
                  onChange={setActiveTag}
                />
              </div>
            </div>
          </div>

          {/* Grid Display */}
          <div className="relative min-h-[400px]">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-[#1E293B]/40 border border-white/5 rounded-2xl p-3 sm:p-4 h-[300px] animate-pulse flex flex-col">
                    <div className="aspect-[4/3] bg-[#0F172A]/60 rounded-xl mb-4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
                    <div className="h-5 bg-white/10 rounded w-2/3 mb-4"></div>
                    <div className="mt-auto h-10 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {!loading && merch.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-32">
                <p className="text-gray-500">No products found.</p>
              </div>
            )}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 transition-all duration-500 ${loading ? "opacity-30 blur-sm" : "opacity-100"}`}
            >
              {merch.map((item) => (
                <div
                  key={item.merchId}
                  className="bg-[#1E293B]/40 border border-white/5 rounded-2xl p-3 sm:p-4 flex flex-col group transition-all hover:bg-[#1E293B]/60"
                >
                  {/* Product Image Box */}
                  <div className="aspect-[4/3] bg-[#0F172A]/60 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden mb-3 sm:mb-4">
                    <img
                      src={
                        item.s3ImageKey ? S3_BASE_URL + item.s3ImageKey : SAMPLE
                      }
                      alt={item.merchName}
                      className="w-full h-full object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1">
                    <span className="text-[#9f8fd8] font-bold mb-1 text-xs sm:text-sm">
                      MERCH {item.merchId}
                    </span>
                    <h3 className="text-white font-medium text-sm sm:text-base mb-1 truncate">
                      {item.merchName}
                    </h3>
                    <p className="text-[#FFB800] font-bold text-base sm:text-lg mb-3 sm:mb-4">
                      ₱{item.basePrice.toLocaleString()}
                    </p>
                    {/* Stock Info Area */}
                    <div className="bg-[#0F172A]/40 rounded-xl p-2 sm:p-3 border border-white/5 flex justify-between items-center mt-auto mb-3 sm:mb-4">
                      <div className="flex flex-col">
                        <span className="text-white/40 text-[10px] font-bold uppercase">
                          Stock
                        </span>
                        <span className="text-white font-bold text-sm sm:text-base">
                          {item.totalStockQuantity}
                        </span>
                      </div>

                      {(item.totalStockQuantity ?? 0) > 0 ? (
                        <span className="bg-[#10B981]/20 text-[#10B981] text-[10px] px-2 sm:px-3 py-1 rounded-lg font-bold uppercase border border-[#10B981]/20">
                          In Stock
                        </span>
                      ) : (
                        <span className="bg-[#EF4444]/20 text-[#EF4444] text-[10px] px-2 sm:px-3 py-1 rounded-lg font-bold uppercase border border-[#EF4444]/20">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    {/* Action Buttons - Show Edit/Delete for managers, View for read-only */}
                    <div className="flex gap-2 mt-auto">
                      {canManageMerch ? (
                        <>
                          <button
                            onClick={() => navigate(item.merchId)}
                            className="cursor-pointer flex-1 bg-[#f9a8f1] text-black py-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold hover:brightness-110"
                          >
                            <FiEdit3 className="text-sm" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="cursor-pointer flex-1 bg-[#EF4444] text-white py-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold hover:brightness-110"
                          >
                            <FiTrash2 className="text-sm" /> Delete
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => navigate(item.merchId)}
                          className="cursor-pointer flex-1 bg-[#6366F1] text-white py-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold hover:brightness-110"
                        >
                          <FiEye className="text-sm" /> View
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => fetchMerch(activeTag)}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setMerchToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
          title="Delete Product"
          message={`Are you sure you want to delete "${merchToDelete?.merchName}"?`}
          warningMessage="This will permanently delete the product and all its variants and items."
        />
      </Layout>
  );
};

export default Index;
