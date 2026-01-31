import { useEffect, useState } from "react";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import { BiSolidCartAdd } from "react-icons/bi";
import Layout from "../../../components/Layout";
import DesktopCarousel from "./components/DesktopCarousel";
import MobileCarousel from "./components/MobileCarousel";
import { useParams, useNavigate } from "react-router-dom";
import type { MerchDetailedResponse } from "../../../interfaces/merch/MerchResponse";
import { getMerchById } from "../../../api/merch";
import { ClothingSizing } from "../../../enums/ClothingSizing";
import type { CartItemRequest } from "../../../interfaces/cart/CartItemRequest";
import type { CartItemResponse } from "../../../interfaces/cart/CartItemResponse";
import { addCartItem } from "../../../api/cart";
import BuyNowModal from "./components/BuyNowModal";
import { toast } from "sonner";
import NotFoundPage from "../../notFound";
import { S3_BASE_URL } from "../../../constant";

const Index = () => {
  const { merchId } = useParams<{ merchId: string }>();
  const navigate = useNavigate();

  // Data state
  const [merch, setMerch] = useState<MerchDetailedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [processingBuy, setProcessingBuy] = useState(false);

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
  const selectedSizeItem = selectedSize
    ? availableSizes.find((item) => item.size === selectedSize)
    : null;

  const currentPrice =
    selectedSizeItem?.price ||
    selectedDesignItem?.price ||
    merch?.basePrice ||
    0;
  const currentStock =
    selectedSizeItem?.stockQuantity || currentVariant?.stockQuantity || 0;
  const selectedMerchVariantItemId =
    selectedSizeItem?.merchVariantItemId ||
    selectedDesignItem?.merchVariantItemId ||
    null;

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
      response.variants.forEach((variant) => {
        variant.items.sort((a, b) => {
          const order = Object.values(ClothingSizing);
          return (
            order.indexOf(a.size as ClothingSizing) -
            order.indexOf(b.size as ClothingSizing)
          );
        });
      });
      setMerch(response);
      setIsNotFound(false);
    } catch (err) {
      setIsNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (merchId) fetchMerch(Number(merchId));
  }, [merchId]);
  useEffect(() => {
    setSelectedSize(null);
    setQuantity(1);
  }, [activeIndex, merchId]);

  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrement = () =>
    setQuantity((prev) => Math.min(currentStock, prev + 1));

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === "" ? 0 : parseInt(e.target.value);
    if (!isNaN(val)) setQuantity(Math.min(Math.max(1, val), currentStock));
  };

  const handleAddToCart = async (
    cartItem: CartItemRequest,
  ): Promise<CartItemResponse | null> => {
    if (!cartItem) return null;
    setAddingToCart(true);
    try {
      const response = await addCartItem(cartItem);
      toast.success("Added to cart! 🛒");
      return response;
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      return null;
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!isValidForPurchase) {
      toast.error(
        merch?.merchType === "CLOTHING"
          ? "Please select a size"
          : "Please select a variant",
      );
      return;
    }
    setShowBuyModal(true);
  };

  const handleConfirmBuy = async () => {
    if (!selectedMerchVariantItemId) return;
    setProcessingBuy(true);
    try {
      await handleAddToCart({
        merchVariantItemId: selectedMerchVariantItemId,
        quantity,
      });
      setShowBuyModal(false);
      navigate("/merch/cart", { state: { selectedMerchVariantItemId } });
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingBuy(false);
    }
  };

  const getSlidePosition = (index: number) => {
    let diff = index - activeIndex;
    const len = merchVariantIds.length;
    if (len > 0)
      diff = ((((diff + len / 2) % len) + len) % len) - Math.floor(len / 2);
    return {
      translateY: diff * 120,
      scale: Math.max(0, 1.1 - Math.abs(diff) * 0.15),
      opacity: Math.max(0, 1 - Math.abs(diff) * 0.3),
      z: 20 - Math.abs(diff),
    };
  };

  if (isNotFound) return <NotFoundPage />;

  return (
    <Layout>
      <AuthenticatedNav />

      <div className="max-w-[90rem] mx-auto px-6 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-start">
          {/* Left: Desktop Variant Selector */}
          <div className="hidden lg:block shrink-0">
            {loading ? (
              <div className="w-[180px] h-[500px] bg-[#242050]/50 border border-white/10 rounded-[2rem] animate-pulse" />
            ) : (
              <DesktopCarousel
                items={merchVariantIds}
                merchVariants={merch?.variants || []}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                getSlidePosition={getSlidePosition}
              />
            )}
          </div>

          {/* Center: Main Product Showcase */}
          <div className="flex-[1.5] w-full group">
            {loading ? (
              <div className="aspect-square bg-[#242050]/50 border border-white/10 rounded-[2rem] animate-pulse flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center p-12 overflow-hidden relative transition-all duration-500 hover:border-purple-500/30">
                {/* Internal Glow Effect */}
                <div className="absolute inset-0 via-transparent to-transparent opacity-50" />
                <img
                  src={
                    currentVariant?.s3ImageKey &&
                    S3_BASE_URL + currentVariant.s3ImageKey
                  }
                  alt="Product Preview"
                  className="w-full h-full object-contain relative z-10 transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
            )}

            {/* Mobile Variant Selector */}
            <div className="lg:hidden mt-8">
              {loading ? (
                <div className="h-20 bg-[#242050]/50 border border-white/10 rounded-[2rem] animate-pulse" />
              ) : (
                <MobileCarousel
                  items={merchVariantIds}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              )}
            </div>
          </div>

          {/* Right: Interaction & Details */}
          <div className="flex-1 w-full flex flex-col gap-8">
            {loading ? (
              <>
                {/* Skeleton Header */}
                <div className="space-y-3">
                  <div className="h-6 w-48 bg-white/10 rounded-full animate-pulse" />
                  <div className="h-12 w-80 bg-white/10 rounded-lg animate-pulse" />
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
                    <div className="h-6 w-20 bg-green-500/20 rounded animate-pulse" />
                  </div>
                </div>

                <div className="h-[1px] bg-white/5 w-full" />

                {/* Skeleton Controls */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-10 w-20 bg-white/5 rounded-xl animate-pulse" />
                      <div className="h-10 w-20 bg-white/5 rounded-xl animate-pulse" />
                      <div className="h-10 w-20 bg-white/5 rounded-xl animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                    <div className="grid grid-cols-5 gap-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="h-11 bg-white/5 rounded-xl animate-pulse"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                    <div className="h-14 w-32 bg-white/5 rounded-2xl animate-pulse" />
                  </div>
                </div>

                {/* Skeleton CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="flex-[2] h-14 bg-yellow-400/50 rounded-2xl animate-pulse" />
                  <div className="flex-1 h-14 bg-white/5 rounded-2xl animate-pulse" />
                </div>
              </>
            ) : (
              <>
                <header className="space-y-3">
                  <div className="inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/50 uppercase">
                    CSPS Official • {merch?.merchType}
                  </div>
                  <h1 className="text-4xl xl:text-5xl font-bold text-white ">
                    {merch?.merchName}
                  </h1>
                  <div className="flex items-center gap-4">
                    <p className="text-3xl font-bold text-white">
                      ₱{currentPrice.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded border ${currentStock > 0 ? "border-green-500/20 text-green-400 bg-green-500/5" : "border-red-500/20 text-red-400 bg-red-500/5"}`}
                    >
                      {currentStock > 0
                        ? `${currentStock} IN STOCK`
                        : "OUT OF STOCK"}
                    </span>
                  </div>
                </header>

                <div className="h-[1px] bg-white/5 w-full" />

                {/* Selection Controls */}
                <div className="space-y-8">
                  {/* Variant Style Selection */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-white/40 uppercase]">
                      Select Style
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {merch?.variants.map((variant, idx) => (
                        <button
                          key={variant.merchVariantId}
                          onClick={() => setActiveIndex(idx)}
                          className={`px-5 py-2.5 rounded-xl border-2 transition-all duration-300 text-sm font-semibold ${
                            activeIndex === idx
                              ? "bg-white/10 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                              : "bg-transparent border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          {variant.color || variant.design}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  {merch?.merchType === "CLOTHING" && (
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold text-white/40 uppercase ">
                        Choose Size
                      </p>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {availableSizes.map((sizeItem) => {
                          const isActive = selectedSize === sizeItem.size;
                          const isOutOfStock = sizeItem.stockQuantity === 0;
                          return (
                            <button
                              key={sizeItem.merchVariantItemId}
                              disabled={isOutOfStock}
                              onClick={() =>
                                setSelectedSize(sizeItem.size as ClothingSizing)
                              }
                              className={`h-11 rounded-xl border-2 transition-all font-bold text-sm ${
                                isActive
                                  ? "bg-white text-black border-white shadow-xl"
                                  : isOutOfStock
                                    ? "opacity-20 cursor-not-allowed border-white/5 line-through"
                                    : "bg-white/5 border-white/5 text-white hover:border-purple-400"
                              }`}
                            >
                              {sizeItem.size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-white/40 uppercase">
                      Quantity
                    </p>
                    <div className="flex items-center gap-6 bg-white/5 border border-white/10 w-fit rounded-2xl p-1.5">
                      <button
                        onClick={handleDecrement}
                        className="w-10 h-10 flex items-center justify-center text-xl text-white/40 hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-8 text-center bg-transparent border-none outline-none font-bold text-lg"
                      />
                      <button
                        onClick={handleIncrement}
                        className="w-10 h-10 flex items-center justify-center text-xl text-white/40 hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* CTA Group */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={handleBuyNow}
                    disabled={
                      !isValidForPurchase || currentStock === 0 || processingBuy
                    }
                    className="flex-[2] bg-[#FDE006] text-black font-bold py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
                  >
                    {processingBuy ? "Processing..." : "Buy Now"}
                  </button>
                  <button
                    onClick={() =>
                      handleAddToCart({
                        merchVariantItemId: selectedMerchVariantItemId!,
                        quantity,
                      })
                    }
                    disabled={
                      addingToCart || !isValidForPurchase || currentStock === 0
                    }
                    className="flex-1 bg-white/5 border border-white/10 backdrop-blur-xl text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
                  >
                    <BiSolidCartAdd className="text-2xl" />
                    {addingToCart ? "Adding..." : "Add"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <BuyNowModal
        open={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        onConfirm={handleConfirmBuy}
        merchName={merch?.merchName || ""}
        design={design}
        quantity={quantity}
        size={selectedSize}
        isProcessing={processingBuy}
      />

      {/* Loading Modal for adding to cart */}
      {addingToCart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#242050] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-12 h-12 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-medium text-lg">Adding to cart...</p>
          </div>
        </div>
      )}

      {/* Loading Modal for buy now processing */}
      {processingBuy && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#242050] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-12 h-12 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-medium text-lg">
              Processing purchase...
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Index;
