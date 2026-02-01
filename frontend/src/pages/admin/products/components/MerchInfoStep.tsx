import React, { type ChangeEvent } from "react";
import { FaCloudUploadAlt, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
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

// --- Reusable "Deposit" Style Input Block ---
const InputBlock = ({
  label,
  error,
  children,
  className = "",
  rightElement,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  rightElement?: React.ReactNode;
}) => (
  <div
    className={`group relative w-full bg-white/5 rounded-2xl px-5 py-3 border transition-all duration-200 ${
      error
        ? "border-red-500/50 bg-red-500/5"
        : "border-transparent hover:border-white/10 hover:bg-white/[0.07]"
    } ${className}`}
  >
    <div className="flex justify-between items-center mb-1">
      <label className="block text-white/40 text-xs font-bold uppercase tracking-wider group-focus-within:text-purple-300 transition-colors">
        {label}
      </label>
      {rightElement}
    </div>
    <div className="relative flex items-center">{children}</div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -bottom-5 left-1 text-red-400 text-[10px] font-medium"
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-full">
      {/* --- Left Column: Image Upload (Takes up 4/12 columns on desktop) --- */}
      <div className="lg:col-span-4 flex flex-col h-full">
        <label
          className={`relative flex-1 min-h-[300px] lg:min-h-0 w-full rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${
            errors.merchImage
              ? "border-red-500/50 bg-red-500/5"
              : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
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
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold border border-white/20">
                  Change Photo
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-[#242050] flex items-center justify-center text-white/50 group-hover:scale-110 group-hover:text-white transition-all duration-300 shadow-xl">
                <FaCloudUploadAlt size={40} />
              </div>
              <div>
                <span className="block text-lg font-bold text-white mb-1">
                  Upload Image
                </span>
                <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">
                  PNG, JPG, WebP
                </span>
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
              className="text-center text-red-400 text-xs font-bold mt-3"
            >
              {errors.merchImage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* --- Right Column: Form Fields (Takes up 8/12 columns) --- */}
      <div className="lg:col-span-8 flex flex-col justify-center">
        <div className="space-y-5">
          {/* Row 1: Name & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputBlock
              label="Product Name"
              error={errors.merchName}
              rightElement={
                <span
                  className={`text-[10px] font-medium ${formState.merchName.length >= 100 ? "text-red-400" : "text-white/20"}`}
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

            <InputBlock label="Price (PHP)" error={errors.basePrice}>
              <div className="flex items-center gap-2 w-full">
                <span className="text-white/30 font-medium text-lg">₱</span>
                <input
                  type="number"
                  value={formState.basePrice || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    onBasePriceChange(value === "" ? "0" : value);
                  }}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full bg-transparent text-white text-lg font-bold placeholder-white/20 focus:outline-none"
                />
              </div>
            </InputBlock>
          </div>

          {/* Row 2: Category */}
          <InputBlock label="Category" error={errors.merchType}>
            <div className="relative w-full">
              <select
                value={formState.merchType}
                onChange={(e) =>
                  onMerchTypeChange(e.target.value as MerchType | "")
                }
                className="w-full bg-transparent text-white text-lg font-medium appearance-none focus:outline-none cursor-pointer [&>option]:bg-[#170657]"
              >
                <option value="" className="text-white/20">
                  Select a category...
                </option>
                {Object.entries(MerchType).map(([key, value]) => (
                  <option key={value} value={value}>
                    {key}
                  </option>
                ))}
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                <FaChevronDown size={12} />
              </div>
            </div>
          </InputBlock>

          {/* Row 3: Description */}
          <InputBlock
            label="Description"
            error={errors.description}
            rightElement={
              <span
                className={`text-[10px] font-medium ${formState.description.length >= 500 ? "text-red-400" : "text-white/20"}`}
              >
                {formState.description.length}/500
              </span>
            }
          >
            <textarea
              value={formState.description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Tell us about this product..."
              maxLength={500}
              rows={4}
              className="w-full bg-transparent text-white text-base font-normal placeholder-white/20 focus:outline-none resize-none leading-relaxed mt-1"
            />
          </InputBlock>

          {/* Actions */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={onNext}
              className="w-full md:w-auto bg-white hover:bg-purple-50 text-[#170657] text-lg font-bold py-4 px-10 rounded-xl shadow-lg shadow-purple-900/20 active:scale-[0.98] transition-all"
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchInfoStep;
