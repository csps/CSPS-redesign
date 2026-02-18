import React, { type ChangeEvent } from "react";
import { FaCloudUploadAlt, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { MerchType } from "../../../../enums/MerchType";
import type { ValidationErrors } from "../util/validation";
import type { MerchFormState } from "../../../../hooks/useMerchForm";
import CustomDropdown from "../../../../components/CustomDropdown";

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

// --- Reusable Modern Input Block ---
const InputBlock = ({
  label,
  error,
  children,
  className = "",
  rightElement,
  noPadding = false,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  rightElement?: React.ReactNode;
  noPadding?: boolean;
}) => (
  <div className={`group relative ${className}`}>
    <div
      className={`relative w-full bg-white/[0.03] hover:bg-white/[0.05] rounded-2xl border-2 transition-all duration-200 ${
        error
          ? "border-red-500/50 bg-red-500/5"
          : "border-transparent focus-within:border-purple-500/50 focus-within:bg-white/[0.05]"
      } ${noPadding ? "p-1.5" : "px-5 py-4"}`}
    >
      <div
        className={`flex justify-between items-center ${noPadding ? "px-3.5 pt-2.5 mb-1" : "mb-2"}`}
      >
        <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider group-focus-within:text-purple-300 transition-colors">
          {label}
        </label>
        {rightElement}
      </div>
      <div className="relative flex items-center">{children}</div>
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -bottom-6 left-2 text-red-400 text-xs font-medium"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

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
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onMerchImageUpload(index, file);
    }
  };

  const categoryOptions = [
    { label: "Select a category...", value: "" },
    ...Object.entries(MerchType).map(([key, value]) => ({
      label: key.charAt(0) + key.slice(1).toLowerCase(),
      value: value,
    })),
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
      {/* --- Left Column: Image Upload --- */}
      <div className="lg:col-span-5 flex flex-col">
        <label
          className={`relative flex-1 min-h-[320px] lg:min-h-[400px] w-full rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden group ${
            errors.merchImage
              ? "border-red-500/50 bg-red-500/5"
              : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-purple-500/30"
          }`}
        >
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
                alt="Merch Preview"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl text-white font-semibold border border-white/20 shadow-xl">
                  Change Photo
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-5 p-8 text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center text-white/40 group-hover:scale-110 group-hover:text-purple-400 transition-all duration-300 border border-white/5">
                <FaCloudUploadAlt size={40} />
              </div>
              <div>
                <span className="block text-lg font-bold text-white mb-2">
                  Upload Product Image
                </span>
                <span className="text-sm text-white/40">
                  Drag & drop or click to browse
                </span>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/50">
                    PNG
                  </span>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/50">
                    JPG
                  </span>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/50">
                    WebP
                  </span>
                </div>
              </div>
            </div>
          )}
        </label>

        <AnimatePresence>
          {errors.merchImage && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center text-red-400 text-sm font-medium mt-3"
            >
              {errors.merchImage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* --- Right Column: Form Fields --- */}
      <div className="lg:col-span-7 flex flex-col justify-center">
        <div className="space-y-6">
          {/* Row 1: Name & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputBlock
              label="Product Name"
              error={errors.merchName}
              rightElement={
                <span
                  className={`text-xs font-medium ${formState.merchName.length >= 100 ? "text-red-400" : "text-white/30"}`}
                >
                  {formState.merchName.length}/100
                </span>
              }
            >
              <input
                type="text"
                value={formState.merchName}
                onChange={(e) => onMerchNameChange(e.target.value)}
                placeholder="e.g. Limited Edition Hoodie"
                maxLength={100}
                className="w-full bg-transparent text-white text-lg font-medium placeholder-white/20 focus:outline-none"
              />
            </InputBlock>

            <InputBlock label="Base Price" error={errors.basePrice}>
              <div className="flex items-center gap-3 w-full">
                <span className="text-purple-400 font-bold text-xl">₱</span>
                <input
                  type="number"
                  value={formState.basePrice || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    onBasePriceChange(value === "" ? "0" : value);
                  }}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full bg-transparent text-white text-lg font-bold placeholder-white/20 focus:outline-none"
                />
              </div>
            </InputBlock>
          </div>

          {/* Row 2: Category */}
          <InputBlock
            label="Product Category"
            error={errors.merchType}
            noPadding
          >
            <CustomDropdown
              options={categoryOptions}
              value={formState.merchType}
              onChange={(val) => onMerchTypeChange(val as MerchType | "")}
              placeholder="Select category..."
              className="bg-transparent border-none !px-0 !py-0 ring-0 focus:ring-0"
            />
          </InputBlock>

          {/* Row 3: Description */}
          <InputBlock
            label="Description"
            error={errors.description}
            rightElement={
              <span
                className={`text-xs font-medium ${formState.description.length >= 500 ? "text-red-400" : "text-white/30"}`}
              >
                {formState.description.length}/500
              </span>
            }
          >
            <textarea
              value={formState.description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Describe your product - materials, features, and what makes it special..."
              maxLength={500}
              rows={4}
              className="w-full bg-transparent text-white text-base placeholder-white/20 focus:outline-none resize-none leading-relaxed"
            />
          </InputBlock>

          {/* Next Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={onNext}
              className="group w-full md:w-auto bg-[#FDE006] hover:brightness-110 text-black text-lg font-bold py-4 px-10 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <span>Continue to Variants</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchInfoStep;
