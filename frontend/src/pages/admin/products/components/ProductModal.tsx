import React, { useState, useCallback } from "react";
import { FaTimes, FaCheck, FaBox, FaLayerGroup } from "react-icons/fa";
import { toast } from "sonner";
import { useMerchForm } from "../../../../hooks/useMerchForm";
import { validateMerchInfo, validateVariants } from "../util/validation";
import { createMerch } from "../../../../api/merch";
import VariantStep from "./VariantStep";
import MerchInfoStep from "./MerchInfoStep";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    formState,
    setMerchName,
    setDescription,
    setMerchType,
    setBasePrice,
    handleMerchImageUpload,
    handleAddClothingVariant,
    handleClothingVariantChange,
    handleSizeCheckChange,
    handleStockQuantityChange,
    handlePriceChangeForSize,
    handleDeleteClothingVariant,
    handleVariantImageUpload,
    handleAddNonClothingVariant,
    handleNonClothingVariantChange,
    handleDeleteNonClothingVariant,
    resetForm,
  } = useMerchForm();

  const handleClose = useCallback(() => {
    resetForm();
    setCurrentStep(1);
    setValidationErrors({});
    setSubmitError(null);
    onClose();
  }, [onClose, resetForm]);

  const handleNextStep = useCallback(() => {
    const validation = validateMerchInfo(formState);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    setValidationErrors({});
    setCurrentStep(2);
  }, [formState]);

  const handleBackStep = useCallback(() => {
    setCurrentStep(1);
    setValidationErrors({});
  }, []);

  const handleSubmit = useCallback(async () => {
    const variantValidation = validateVariants(formState);
    if (!variantValidation.isValid) {
      setValidationErrors(variantValidation.errors);
      setSubmitError("Please fix all validation errors before proceeding");
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    setValidationErrors({});

    try {
      const result = await createMerch(formState);

      if (result.success) {
        resetForm();
        setCurrentStep(1);
        setValidationErrors({});
        setShowSuccessModal(true);
        onSuccess?.();
      } else {
        setSubmitError(result.error || "Failed to create product");
        toast.error(result.error || "Failed to create product");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [formState, resetForm, onSuccess]);

  if (!isOpen && !showSuccessModal) return null;

  // Step Indicator Component
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-3 mb-8">
      {/* Step 1 */}
      <div className="flex items-center gap-3">
        <div
          className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
            currentStep >= 1
              ? "bg-gradient-to-br from-purple-500 to-purple-700"
              : "bg-white/10"
          }`}
        >
          {currentStep > 1 ? (
            <FaCheck className="text-white text-lg" />
          ) : (
            <FaBox
              className={`text-lg ${currentStep === 1 ? "text-white" : "text-white/40"}`}
            />
          )}
          {currentStep === 1 && (
            <div className="absolute inset-0 rounded-2xl bg-purple-400/20 animate-pulse" />
          )}
        </div>
        <div className="hidden sm:block">
          <p
            className={`text-sm font-bold ${currentStep >= 1 ? "text-white" : "text-white/40"}`}
          >
            Product Info
          </p>
          <p className="text-xs text-white/40">Basic details</p>
        </div>
      </div>

      {/* Connector */}
      <div className="flex-1 max-w-[80px] h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500 ${
            currentStep >= 2 ? "w-full" : "w-0"
          }`}
        />
      </div>

      {/* Step 2 */}
      <div className="flex items-center gap-3">
        <div
          className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
            currentStep >= 2
              ? "bg-gradient-to-br from-purple-500 to-purple-700"
              : "bg-white/10"
          }`}
        >
          <FaLayerGroup
            className={`text-lg ${currentStep >= 2 ? "text-white" : "text-white/40"}`}
          />
          {currentStep === 2 && (
            <div className="absolute inset-0 rounded-2xl bg-purple-400/20 animate-pulse" />
          )}
        </div>
        <div className="hidden sm:block">
          <p
            className={`text-sm font-bold ${currentStep >= 2 ? "text-white" : "text-white/40"}`}
          >
            Variants
          </p>
          <p className="text-xs text-white/40">Stock & options</p>
        </div>
      </div>
    </div>
  );

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative bg-gradient-to-b from-[#1e1a4a] to-[#151238] rounded-3xl border border-white/10 p-10 max-w-md w-full text-center overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto transform rotate-3">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-3">
            Product Created!
          </h3>
          <p className="text-white/60 mb-8 leading-relaxed">
            Your new merchandise has been successfully added to the catalog and
            is ready for sale.
          </p>

          <button
            onClick={() => {
              setShowSuccessModal(false);
              handleClose();
            }}
            className="w-full bg-[#FDE006] hover:brightness-110 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue to Products
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6">
          <div className="relative w-full max-w-6xl bg-gradient-to-b from-[#1e1a4a] to-[#151238] rounded-3xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="relative px-6 md:px-10 pt-8 pb-6 border-b border-white/5">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
                aria-label="Close modal"
              >
                <FaTimes size={18} />
              </button>

              {/* Title Section */}
              <div className="relative z-10 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {currentStep === 1 ? "Add New Product" : "Configure Variants"}
                </h2>
                <p className="text-white/50 text-sm sm:text-base">
                  {currentStep === 1
                    ? "Fill in the basic information about your merchandise"
                    : "Set up stock quantities and pricing options"}
                </p>
              </div>

              {/* Step Indicator */}
              <div className="mt-8">
                <StepIndicator />
              </div>
            </div>

            {/* Content Area */}
            <div className="px-6 md:px-10 py-8 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {/* Submit Error Alert */}
              {submitError && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <FaTimes className="text-red-400" size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-400">
                      {submitError}
                    </p>
                    <p className="text-xs text-red-400/60 mt-1">
                      Please check your inputs and try again.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 1: Base Merch Information */}
              {currentStep === 1 && (
                <MerchInfoStep
                  formState={formState}
                  errors={validationErrors}
                  onMerchNameChange={setMerchName}
                  onDescriptionChange={setDescription}
                  onMerchTypeChange={setMerchType}
                  onBasePriceChange={setBasePrice}
                  onMerchImageUpload={handleMerchImageUpload}
                  onNext={handleNextStep}
                />
              )}

              {/* Step 2: Variant Management */}
              {currentStep === 2 && (
                <VariantStep
                  formState={formState}
                  errors={validationErrors}
                  isLoading={isLoading}
                  onBack={handleBackStep}
                  onAddClothingVariant={handleAddClothingVariant}
                  onAddNonClothingVariant={handleAddNonClothingVariant}
                  onClothingVariantChange={handleClothingVariantChange}
                  onNonClothingVariantChange={handleNonClothingVariantChange}
                  onSizeCheckChange={handleSizeCheckChange}
                  onStockQuantityChange={handleStockQuantityChange}
                  onPriceChangeForSize={handlePriceChangeForSize}
                  onVariantImageUpload={handleVariantImageUpload}
                  onDeleteClothingVariant={handleDeleteClothingVariant}
                  onDeleteNonClothingVariant={handleDeleteNonClothingVariant}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && <SuccessModal />}
    </>
  );
};

export default ProductModal;
