import React, { type ChangeEvent } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MerchType } from "../../../../enums/MerchType";
import type { ValidationErrors } from "../util/validation";
import type { MerchFormState } from "../../../../hooks/useMerchForm";

interface MerchInfoStepProps {
  formState: MerchFormState;
  errors?: ValidationErrors;
  onMerchNameChange: (name: string) => void;
  onDescriptionChange: (desc: string) => void;
  onMerchTypeChange: (type: MerchType | "") => void;
  onBasePriceChange: (price: string) => void;
  onMerchImageUpload: (index: number, file: File) => void;
  onNext: () => void;
}

const MerchInfoStep: React.FC<MerchInfoStepProps> = ({
  formState,
  errors = {},
  onMerchNameChange,
  onDescriptionChange,
  onMerchTypeChange,
  onBasePriceChange,
  onMerchImageUpload,
  onNext,
}) => {
  const handleImageUpload = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onMerchImageUpload(index, file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 lg:mt-0">
      {/* Left Column: Image Upload */}
      <div className="flex flex-col items-center justify-center ">
        <label className=" w-full lg:h-[60%] md:h-[100%] bg-[#242050] rounded-3xl border-2 border-dashed border-white/20 flex items-center justify-center text-white/50 cursor-pointer hover:bg-[#2f2b60] transition overflow-hidden relative group">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleImageUpload(0, e)}
          />
          {formState.merchImagePreview ? (
            <>
              <img
                src={formState.merchImagePreview}
                alt="Product"
                className="w-full h-full object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                <span className="text-white font-bold text-xl">
                  Change Image
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <FaCloudUploadAlt size={120} className="text-white/20" />
              <span className="text-lg font-medium text-white/40 uppercase tracking-widest">
                Upload Main Image
              </span>
            </div>
          )}
        </label>
        {errors.merchImage && (
          <p className="text-sm text-red-400 mt-3 font-medium">
            {errors.merchImage}
          </p>
        )}
      </div>

      {/* Right Column: Form Fields */}
      <div className="lg:col-span-2 flex flex-col gap-8 md:mt-4 lg:mt-0">
        {/* Name & Price */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xl font-semibold text-white/80 mb-3">
              Name
            </label>
            <input
              type="text"
              value={formState.merchName}
              onChange={(e) => onMerchNameChange(e.target.value)}
              placeholder="Product name"
              maxLength={100}
              className={`w-full bg-[#242050] rounded-2xl px-6 py-5 outline-none placeholder-white/20 text-xl text-white border-2 transition ${
                errors.merchName
                  ? "border-red-500"
                  : "border-transparent focus:border-white/30"
              }`}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-base text-white/40">
                {formState.merchName.length}/100
              </span>
              {errors.merchName && (
                <span className="text-base text-red-400 font-medium">
                  {errors.merchName}
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xl font-semibold text-white/80 mb-3">
              Price
            </label>
            <input
              type="number"
              value={formState.basePrice}
              onChange={(e) => onBasePriceChange(e.target.value)}
              placeholder="₱ 0.00"
              min="0"
              step="0.01"
              className={`w-full bg-[#242050] rounded-2xl px-6 py-5 outline-none placeholder-white/20 text-xl font-bold text-white border-2 transition ${
                errors.basePrice
                  ? "border-red-500"
                  : "border-transparent focus:border-white/30"
              }`}
            />
            {errors.basePrice && (
              <span className="text-base text-red-400 mt-2 block font-medium">
                {errors.basePrice}
              </span>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xl font-semibold text-white/80 mb-3">
            Category
          </label>
          <div className="relative">
            <select
              value={formState.merchType}
              onChange={(e) =>
                onMerchTypeChange(e.target.value as MerchType | "")
              }
              className={`w-full bg-[#242050] rounded-2xl px-6 py-5 outline-none appearance-none cursor-pointer text-xl text-white border-2 transition ${
                errors.merchType
                  ? "border-red-500"
                  : "border-transparent focus:border-white/30"
              }`}
            >
              <option value="">Select Category</option>
              {Object.entries(MerchType).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          {errors.merchType && (
            <span className="text-base text-red-400 mt-2 block font-medium">
              {errors.merchType}
            </span>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xl font-semibold text-white/80 mb-3">
            Description (Optional)
          </label>
          <textarea
            value={formState.description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Detailed product description..."
            maxLength={500}
            rows={4}
            className={`w-full bg-[#242050] rounded-2xl px-6 py-5 outline-none placeholder-white/20 text-xl text-white border-2 transition resize-none ${
              errors.description
                ? "border-red-500"
                : "border-transparent focus:border-white/30"
            }`}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-base text-white/40">
              {formState.description.length}/500
            </span>
            {errors.description && (
              <span className="text-base text-red-400 font-medium">
                {errors.description}
              </span>
            )}
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onNext}
            className="bg-white hover:bg-white/90 text-[#242050] text-2xl font-bold py-5 px-14 rounded-2xl shadow-2xl transition transform hover:scale-105 active:scale-95"
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default MerchInfoStep;
