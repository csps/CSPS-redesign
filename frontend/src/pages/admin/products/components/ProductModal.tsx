import React, { useState, useCallback } from "react";
import { FaTimes } from "react-icons/fa";
import { useMerchForm } from "../../../../hooks/useMerchForm";
import { validateMerchInfo, validateVariants } from "../util/validation";
import { createMerch } from "../../../../api/merch";
import VariantStep from "./VariantStep";
import MerchInfoStep from "./MerchInfoStep";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken?: string;
  onSuccess?: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  accessToken = "",
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    console.log(`Submitting form state: ${JSON.stringify(formState)}`);

    const result = await createMerch(formState);

    if (result.success) {
      resetForm();
      setCurrentStep(1);
      setValidationErrors({});
      onSuccess?.();
      handleClose();
    } else {
      setSubmitError(result.error || "Failed to create product");
    }

    setIsLoading(false);
  }, [formState, accessToken, resetForm, onSuccess, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50 backdrop-blur-sm p-4 sm:p-6 ">
      <div className="relative w-full max-w-6xl bg-[#1a163d] rounded-3xl border border-white/10 shadow-2xl p-6 md:p-10 sm:p-10 not-sm:p-11 text-white animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white transition cursor-pointer"
          aria-label="Close modal"
        >
          <FaTimes size={24} />
        </button>

        {/* Submit Error Alert */}
        {submitError && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-sm text-red-400">{submitError}</p>
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
            onVariantImageUpload={handleVariantImageUpload}
            onDeleteClothingVariant={handleDeleteClothingVariant}
            onDeleteNonClothingVariant={handleDeleteNonClothingVariant}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default ProductModal;
