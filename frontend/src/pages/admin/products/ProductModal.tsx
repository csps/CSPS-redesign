import React, { useState, type ChangeEvent } from "react";
import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose }) => {
  // State for images
  const [images, setImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  // State for sizes
  const [selectedSizes, setSelectedSizes] = useState<Record<string, boolean>>({
    XS: false,
    S: false,
    M: false,
    L: false,
  });

  if (!isOpen) return null;

  // --- Handlers ---
  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [size]: !prev[size] }));
  };

  const handleImageUpload = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => {
          const newImages = [...prev];
          newImages[index] = reader.result as string;
          return newImages;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const sizes: string[] = ["XS", "S", "M", "L"];
  const inventorySizes: string[] = [
    "Qty",
    "XS",
    "S",
    "M",
    "L",
    "2L",
    "3L",
    "4L",
  ];

  return (
    // Backdrop with padding to prevent edge touching
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50 backdrop-blur-sm p-4 sm:p-6">
      {/* Modal Container 
          - max-h-[90vh] + overflow-y-auto: Ensures scrolling on mobile
          - p-6 md:p-8: Adaptive padding
      */}
      <div className="relative w-full max-w-4xl bg-[#1a163d] rounded-3xl border border-white/10 shadow-2xl p-6 md:p-8 text-white animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {/* Header / Close Button */}
        <div className="flex justify-between items-center mb-6 lg:mb-0 lg:absolute lg:top-6 lg:right-6">
          <h2 className="text-xl font-bold lg:hidden">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition cursor-pointer"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-2 lg:mt-0">
          {/* Left Column: Image Upload */}
          <div className="flex flex-col gap-4">
            {/* Main Upload Area */}
            <label className="aspect-square bg-[#242050] rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/50 cursor-pointer hover:bg-[#2f2b60] transition overflow-hidden relative group">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageUpload(0, e)}
              />

              {images[0] ? (
                <>
                  <img
                    src={images[0]}
                    alt="Main Upload"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                    <span className="text-white font-medium text-sm">
                      Change
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <FaCloudUploadAlt size={50} className="mb-2" />
                  <span className="text-sm">Main Image</span>
                </>
              )}
            </label>

            {/* Thumbnail Uploads */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {images.map((img, index) => (
                <label
                  key={index}
                  className={`aspect-square bg-[#242050] rounded-xl border-2 border-dashed ${
                    index === 0 ? "border-purple-500/50" : "border-white/20"
                  } flex items-center justify-center cursor-pointer hover:bg-[#2f2b60] transition relative overflow-hidden`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleImageUpload(index, e)}
                  />

                  {img ? (
                    <img
                      src={img}
                      alt={`Upload ${index}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaCloudUploadAlt size={16} className="text-white/30" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Right Column: Form Details */}
          <div className="lg:col-span-2 flex flex-col gap-5 md:gap-6">
            {/* Name & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full bg-[#242050] rounded-xl px-4 py-3 outline-none placeholder-white/30 text-white border border-transparent focus:border-white/20 transition"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  placeholder="P"
                  className="w-full bg-[#242050] rounded-xl px-4 py-3 outline-none placeholder-white/30 text-white border border-transparent focus:border-white/20 transition"
                />
              </div>
            </div>

            {/* Category & Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">
                  Category
                </label>
                <select className="w-full bg-[#242050] rounded-xl px-4 py-3 outline-none appearance-none cursor-pointer text-white border border-transparent focus:border-white/20 transition">
                  <option value="" disabled selected>
                    Select Category
                  </option>
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  className="w-full bg-[#242050] rounded-xl px-4 py-3 outline-none placeholder-white/30 text-white border border-transparent focus:border-white/20 transition"
                />
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm text-white/60 mb-2">Size:</label>
              <div className="flex flex-wrap gap-4">
                {sizes.map((size) => (
                  <label
                    key={size}
                    className="flex items-center gap-2 cursor-pointer group bg-[#242050] px-3 py-2 rounded-lg sm:bg-transparent sm:p-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSizes[size]}
                      onChange={() => handleSizeChange(size)}
                      className="accent-[#4d4c7d] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-white/80 group-hover:text-white transition">
                      {size}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Inventory Management */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Inventory Management
              </label>
              {/* grid-cols-2 on mobile, grid-cols-4 on desktop */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {inventorySizes.map((label) => (
                  <div
                    key={label}
                    className="bg-[#242050] rounded-xl p-3 flex flex-col border border-transparent focus-within:border-white/20 transition"
                  >
                    <span className="text-xs text-white/60 mb-1">{label}</span>
                    <input
                      type="text"
                      placeholder="Stock"
                      className="bg-transparent border-none outline-none text-sm placeholder-white/30 w-full text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex flex-col sm:flex-row justify-end mt-4 pt-4 border-t border-white/10 lg:border-none lg:pt-0">
              <button className="w-full sm:w-auto bg-[#4d4c7d] hover:bg-[#5e5c94] text-white font-bold py-3 px-8 rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95">
                Save Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
