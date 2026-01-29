import { useEffect, useState } from "react";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import SAMPLE from "../../../assets/image 8.png";
import { BiSolidCartAdd } from "react-icons/bi";
import Layout from "../../../components/Layout";
import DesktopCarousel from "./components/DesktopCarousel";
import MobileCarousel from "./components/MobileCarousel";
import { useParams } from "react-router-dom";
import type { MerchDetailedResponse } from "../../../interfaces/merch/MerchResponse";
import { getMerchById } from "../../../api/merch";
import { ClothingSizing } from "../../../enums/ClothingSizing";
import type { CartItemRequest } from "../../../interfaces/cart/CartItemRequest";
import type { CartItemResponse } from "../../../interfaces/cart/CartItemResponse";
import { addCartItem } from "../../../api/cart";
import { useNavigate } from "react-router-dom";
import BuyNowModal from "./components/BuyNowModal";
import { toast } from "sonner";
import NotFoundPage from "../../notFound";
import LoadingPage from "../../loading";
import { S3_BASE_URL } from "../../../constant";

const Index = () => {
  const { merchId } = useParams<{ merchId: string }>();
  const navigate = useNavigate();

  // Data state
  const [merch, setMerch] = useState<MerchDetailedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  // Selection state
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ClothingSizing | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Modal state
  const [showBuyModal, setShowBuyModal] = useState(false);

  // Computed values
  const currentVariant = merch?.variants[activeIndex];
  const availableSizes = currentVariant?.items || [];
  const design = currentVariant?.design || "";

  const selectedDesignItem = currentVariant?.items?.[0] || null;

  // Get selected size item for pricing and stock
  const selectedSizeItem = selectedSize
    ? availableSizes.find((item) => item.size === selectedSize)
    : null;

  const selectedSizePrice = selectedSizeItem?.price;
  const selectedDesignPrice = selectedDesignItem?.price;

  const currentPrice =
    selectedSizePrice || // For CLOTHING with size selected
    selectedDesignPrice || // For NON-CLOTHING (stickers, etc.)
    merch?.basePrice || // Fallback to base price
    0;

  const currentStock =
    selectedSizeItem?.stockQuantity || currentVariant?.stockQuantity || 0;

  const selectedMerchVariantItemId =
    selectedSizeItem?.merchVariantItemId ||
    selectedDesignItem?.merchVariantItemId ||
    null;

  // Validation for Buy Now button
  const isValidForPurchase =
    merch?.merchType === "CLOTHING"
      ? !!selectedSize && !!currentVariant
      : !!currentVariant;

  const merchVariantIds = merch?.variants.map((v) => v.merchVariantId) || [];

  // ========== Data Fetching ==========
  const fetchMerch = async (id: number) => {
    setLoading(true);
    try {
      const response = await getMerchById(id);

      // Sort items by size order
      response.variants.forEach((variant) => {
        variant.items.sort((a, b) => {
          if (!a.size && !b.size) return 0;
          if (!a.size) return 1;
          if (!b.size) return -1;
          const order = Object.values(ClothingSizing);
          const aIndex = order.indexOf(a.size as ClothingSizing);
          const bIndex = order.indexOf(b.size as ClothingSizing);
          return aIndex - bIndex;
        });
      });

      setMerch(response);
      setIsNotFound(false);
      setActiveIndex(0);
      setSelectedSize(null);
    } catch (err) {
      console.error("Fetch failed:", err);
      setIsNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (merchId) {
      fetchMerch(Number(merchId));
    }
  }, [merchId]);

  useEffect(() => {
    // Reset size selection when variant changes
    console.log(`MERCH: ${JSON.stringify(merch)}`);
    console.log(
      `SELECTED MERCH VARIANT ITEM ID: ${selectedMerchVariantItemId}`,
    );
  }, [activeIndex]);

  // ========== Selection Handlers ==========
  useEffect(() => {
    // Reset selections when variant changes
    setSelectedSize(null);
    setQuantity(1);
  }, [activeIndex, merchId]);

  const handleVariantClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleSizeSelect = (size: ClothingSizing) => {
    setSelectedSize(size);
  };

  // ========== Quantity Handlers ==========
  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(currentStock, prev + 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setQuantity(0);
      return;
    }

    const num = parseInt(value);
    if (!isNaN(num)) {
      setQuantity(Math.min(Math.max(1, num), currentStock));
    }
  };

  const handleQuantityBlur = () => {
    if (quantity < 1) setQuantity(1);
  };

  // ========== Cart Actions ==========
  const handleAddToCart = async (
    cartItem: CartItemRequest,
  ): Promise<CartItemResponse | null> => {
    if (!cartItem) return null;

    if (merch?.merchType === "CLOTHING" && !selectedSize) {
      toast.error("Please select a size first");
      return null;
    }
    toast.success("Item added to cart! 🛒");

    try {
      const response = await addCartItem(cartItem);
      toast.success("Item added to cart! 🛒");
      return response;
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      return null;
    }
  };

  const handleBuyNow = () => {
    if (!isValidForPurchase) {
      toast.error(
        merch?.merchType === "CLOTHING"
          ? "Please select a size first"
          : "Please select a variant",
      );
      return;
    }
    setShowBuyModal(true);
  };

  const handleConfirmBuy = async () => {
    if (!selectedMerchVariantItemId) {
      toast.error("No variant selected");
      return;
    }

    if (merch?.merchType === "CLOTHING" && !selectedSize) {
      toast.error("Please select a size first");
      return;
    }

    try {
      const cartItemRequest: CartItemRequest = {
        merchVariantItemId: selectedMerchVariantItemId,
        quantity,
      };

      console.log(`Cart Item Request: ${JSON.stringify(cartItemRequest)}`);

      await handleAddToCart(cartItemRequest);
      setShowBuyModal(false);
      navigate("/merch/cart", {
        state: { selectedMerchVariantItemId },
      });
    } catch (err) {
      console.error("Error during Buy Now:", err);
    }
  };

  // ========== Carousel Position Calculator ==========
  const getSlidePosition = (index: number) => {
    let diff = index - activeIndex;
    const len = merchVariantIds.length;

    if (len > 0) {
      diff = ((((diff + len / 2) % len) + len) % len) - Math.floor(len / 2);
    }

    const itemHeight = 120;
    const scaleReduction = 0.15;
    const opacityReduction = 0.3;

    return {
      translateY: diff * itemHeight,
      scale: Math.max(0, 1.1 - Math.abs(diff) * scaleReduction),
      opacity: Math.max(0, 1 - Math.abs(diff) * opacityReduction),
      z: 20 - Math.abs(diff),
    };
  };

  // ========== Render Guards ==========
  if (loading || !merch) {
    return <LoadingPage />;
  }

  if (isNotFound) {
    return <NotFoundPage />;
  }

  // ========== Main Render ==========
  return (
    <Layout>
      <AuthenticatedNav />

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left - Desktop Carousel */}
        <DesktopCarousel
          items={merchVariantIds}
          merchVariants={merch.variants}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          getSlidePosition={getSlidePosition}
        />

        {/* Center - Main Image */}
        <div className="flex-[2] flex flex-col items-center justify-center relative">
          <img
            src={
              currentVariant?.s3ImageKey
                ? S3_BASE_URL + currentVariant.s3ImageKey
                : SAMPLE
            }
            alt="Preview"
            className="w-full max-w-[350px] h-full max-h-[400px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105"
          />

          {/* Mobile Carousel */}
          <div className="lg:hidden w-full mt-8">
            <MobileCarousel
              items={merchVariantIds}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="flex flex-col gap-6 flex-1 text-left py-10 lg:py-20">
          {/* Header */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-widest">
              {merch.merchName}
            </h1>
            <p className="text-lg text-purple-200">
              ₱ {currentPrice.toFixed(2)}
            </p>
            <p className="text-sm text-gray-300">Stock: {currentStock}</p>
          </div>

          {/* Clothing-specific options */}
          {merch.merchType === "CLOTHING" ? (
            <div className="space-y-6">
              {/* Color Selection */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Color
                </p>
                <div className="flex gap-3 flex-wrap">
                  {merch.variants.map((variant, idx) => (
                    <button
                      key={variant.merchVariantId}
                      onClick={() => handleVariantClick(idx)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        activeIndex === idx
                          ? "border-purple-500 ring-2 ring-purple-500/20 bg-purple-500/10"
                          : "border-white/10 hover:border-purple-400"
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.length > 0 ? (
                    availableSizes.map((sizeItem) => {
                      const isActive = selectedSize === sizeItem.size;
                      const isOutOfStock = sizeItem.stockQuantity === 0;

                      return (
                        <button
                          key={sizeItem.merchVariantItemId}
                          onClick={() =>
                            !isOutOfStock && handleSizeSelect(sizeItem.size)
                          }
                          disabled={isOutOfStock}
                          className={`min-w-[56px] px-3 py-2 text-sm font-semibold border transition-all rounded-md ${
                            isActive
                              ? "bg-purple-600 border-purple-500 text-white shadow-lg scale-105"
                              : isOutOfStock
                                ? "border-white/10 text-gray-500 cursor-not-allowed opacity-50 line-through"
                                : "border-white/10 text-gray-300 hover:border-purple-400"
                          }`}
                        >
                          <div>{sizeItem.size}</div>
                          <div className="text-xs opacity-70">
                            ({sizeItem.stockQuantity})
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">No sizes available</p>
                  )}
                </div>
                {selectedSize && currentStock > 0 && (
                  <p className="text-sm text-green-400">
                    ✓ {currentStock} items available
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Design Selection (Non-Clothing) */
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Design
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {merch.variants.map((variant, index) => (
                  <button
                    key={variant.merchVariantId}
                    onClick={() => handleVariantClick(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all p-1 bg-white/5 ${
                      activeIndex === index
                        ? "border-purple-500 ring-2 ring-purple-500/20"
                        : "border-transparent hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={
                        variant.s3ImageKey
                          ? S3_BASE_URL + variant.s3ImageKey
                          : SAMPLE
                      }
                      alt="variant"
                      className="w-full h-full object-cover rounded-md"
                    />
                    {activeIndex === index && (
                      <div className="absolute top-0 right-0 bg-purple-500 text-white p-0.5 rounded-bl-lg">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-10 w-full max-w-[300px] mt-4">
            <p className="text-l font-medium text-gray-200">Quantity</p>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                className="text-2xl font-light hover:text-purple-400 transition-colors cursor-pointer p-2"
              >
                -
              </button>

              <div className="relative flex flex-col items-center">
                <input
                  type="text"
                  value={quantity === 0 ? "" : quantity}
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur}
                  className="w-12 text-center bg-transparent border-none outline-none text-xl font-semibold appearance-none"
                />
                <div className="w-10 h-[1px] bg-gray-400 group-focus-within:bg-purple-500 transition-colors mt-1" />
              </div>

              <button
                onClick={handleIncrement}
                className="text-2xl font-light hover:text-purple-400 transition-colors cursor-pointer p-2"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 mt-10">
            <button
              onClick={() => {
                handleAddToCart({
                  merchVariantItemId: selectedMerchVariantItemId!,
                  quantity: quantity,
                });
              }}
              className="text-black bg-white flex items-center justify-center gap-2 px-4 py-3 rounded-full cursor-pointer hover:opacity-90 transition-all"
            >
              <BiSolidCartAdd className="text-xl" />
              <span className="font-semibold">Add to cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!isValidForPurchase}
              className={`text-black bg-[#FDE006] px-6 py-3 rounded-full cursor-pointer hover:bg-[#e6cc05] transition-all ${
                !isValidForPurchase ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Buy Now Modal */}
      <BuyNowModal
        open={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        onConfirm={() => handleConfirmBuy()}
        merchName={merch.merchName}
        design={design}
        quantity={quantity}
        size={selectedSize}
      />
    </Layout>
  );
};
export default Index;
