import React, { use, useEffect, useState } from "react";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import SAMPLE from "../../../assets/image 8.png";
import { BiSolidCartAdd } from "react-icons/bi";
import Layout from "../../../components/Layout";
import DesktopCarousel from "./components/DesktopCarousel";
import MobileCarousel from "./components/MobileCarousel";
import { useParams } from "react-router-dom";
import type { MerchVariantResponse } from "../../../interfaces/merch_variant/MerchVariantResponse";
import { getMerchVariantByMerchId } from "../../../api/merch_variant";
import type { MerchDetailedResponse } from "../../../interfaces/merch/MerchResponse";
import { getMerchById } from "../../../api/merch";
import { ClothingSizing } from "../../../enums/ClothingSizing";
import type { CartItemRequest } from "../../../interfaces/cart/CartItemRequest";
import { addCartItem } from "../../../api/cart";
import { toast } from "sonner";
import NotFoundPage from "../../notFound";

const Index = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { merchId } = useParams<{ merchId: string }>();
  const [merch, setMerch] = useState<MerchDetailedResponse | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  // quantity state
  const [quantity, setQuantity] = useState<number>(1);

  // Get selected merch variant ID based on active index
  const selectedVariant = merch?.variants[activeIndex];
  const selectedMerchVariantId = selectedVariant?.merchVariantId || null;

  const design = merch?.variants[activeIndex]?.design || "";

  useEffect(() => {
    console.log("Selected Design:", design);
  }, [design]);

  //

  // Clothing Size State
  const [selectedSize, setSelectedSize] = useState<ClothingSizing | null>(null);

  const fetchMerch = async (merchId: number) => {
    try {
      const getMerchResponse = await getMerchById(merchId);

      setMerch(getMerchResponse);
      setIsNotFound(false); // Reset if a subsequent fetch succeeds
      setActiveIndex(0);
      setSelectedSize(null);
    } catch (err) {
      console.error("Fetch failed:", err);
      setIsNotFound(true);
      // Handle other network errors here if needed
    }
  };

  useEffect(() => {
    if (merchId) {
      fetchMerch(Number(merchId));
    }
  }, [merchId]);
  // Main render logic

  // Logic for quantity
  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    const maxStock = merch?.variants[activeIndex]?.stockQuantity || 1;
    setQuantity((prev) => Math.min(maxStock, prev + 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const maxStock = selectedVariant?.stockQuantity || 1;

    if (value === "") {
      setQuantity(0); // Allow clearing the input temporarily
      return;
    }

    const num = parseInt(value);
    if (!isNaN(num)) {
      setQuantity(Math.min(Math.max(1, num), maxStock));
    }
  };

  const handleBlur = () => {
    if (quantity < 1) setQuantity(1); // Reset to 1 if left empty or 0
  };

  useEffect(() => {
    setQuantity(1);
  }, [activeIndex, merchId]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const merchVariantIds = merch
    ? merch.variants.map((v) => v.merchVariantId)
    : [];

  const getSlidePosition = (index: number) => {
    let diff = index - activeIndex;

    // Circular logic: Adjust diff to find the shortest path in the circle
    const len = merchVariantIds.length;
    if (len > 0) {
      diff = ((((diff + len / 2) % len) + len) % len) - Math.floor(len / 2);
    }

    // Configuration for spacing and scaling
    const itemHeight = 120; // Distance between items
    const scaleReduction = 0.15; // How much smaller items get as they move away
    const opacityReduction = 0.3; // How much they fade

    // Calculate values dynamically
    return {
      translateY: diff * itemHeight,
      scale: Math.max(0, 1.1 - Math.abs(diff) * scaleReduction),
      opacity: Math.max(0, 1 - Math.abs(diff) * opacityReduction),
      z: 20 - Math.abs(diff),
    };
  };

  const handleAddToCart = async (cartItem: CartItemRequest) => {
    if (!cartItem) return;

    // Optional: Size validation for clothing
    if (merch?.merchType === "CLOTHING" && !selectedSize) {
      toast.error("Please select a size first");
      return;
    }

    try {
      console.log("Adding to cart:", cartItem);

      const addToCartResponse = await addCartItem(cartItem);

      // If we reach here, it was successful
      toast.success("Item added to cart! 🛒");
      console.log("Added to cart:", addToCartResponse);
    } catch (err: any) {
      // This catches the re-thrown error from the service layer
      toast.error(err.message || "Something went wrong");
    }
  };

  if (isNotFound) {
    return <NotFoundPage />;
  }

  return (
    <Layout>
      <AuthenticatedNav />

      {/* === Main Layout === */}

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left */}
        <DesktopCarousel
          items={merchVariantIds}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          getSlidePosition={getSlidePosition}
        />

        <div className="flex-[2] flex flex-col items-center justify-center relative">
          {/* Dynamic Image based on activeIndex */}
          <img
            src={SAMPLE}
            alt="Preview"
            className="w-full max-w-[350px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105"
          />

          {/* Mobile indicators/carousel shown only on small screens */}
          <div className="lg:hidden w-full mt-8">
            <MobileCarousel
              items={merchVariantIds}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          </div>
        </div>

        {/* Right  == Info*/}
        <div className="flex flex-col gap-6 flex-1 text-left py-10 lg:py-20">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-widest">
              {merch?.merchName}
            </h1>
            <p className="text-lg text-purple-200">₱ {merch?.price}</p>
            <p className="text-sm text-gray-300">
              Stock: {merch?.variants[activeIndex]?.stockQuantity}
            </p>
          </div>

          {merch?.merchType === "CLOTHING" ? (
            <div className="space-y-6">
              {/* Color Selection */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Color
                </p>
                <div className="flex gap-3 flex-wrap">
                  {["bg-white", "bg-blue-500"].map((color, idx) => (
                    <button
                      key={idx}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        idx === 0
                          ? "border-purple-500 ring-2 ring-purple-500/20"
                          : "border-transparent"
                      } ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {Object.values(ClothingSizing).map((size) => {
                    const isActive = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)} // Set active size
                        className={`min-w-[56px] px-3 py-2 text-sm font-semibold border transition-all rounded-md 
                                  ${
                                    isActive
                                      ? "bg-purple-600 border-purple-500 text-white shadow-lg scale-105"
                                      : "border-white/10 text-gray-300 hover:border-purple-400"
                                  }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Design Selection (Non-Clothing) */
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Design
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {merch?.variants.map((variant, index) => (
                  <button
                    key={variant.merchVariantId}
                    onClick={() => handleClick(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all p-1 bg-white/5 ${
                      activeIndex === index
                        ? "border-purple-500 ring-2 ring-purple-500/20"
                        : "border-transparent hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={SAMPLE}
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
                  onBlur={handleBlur}
                  className="w-12 text-center bg-transparent border-none outline-none text-xl font-semibold appearance-none"
                />
                {/* Dynamic underline color to show focus */}
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
          <div className="flex flex-col sm:flex-row gap-5 mt-10">
            <button
              onClick={() =>
                handleAddToCart({
                  merchVariantId: selectedMerchVariantId!,
                  quantity,
                })
              }
              className="text-black bg-white flex items-center justify-center gap-2 px-4 py-3 rounded-full cursor-pointer hover:opacity-90 transition-all"
            >
              <BiSolidCartAdd className="text-xl" />
              <span className="font-semibold">Add to cart</span>
            </button>

            <button className="text-black bg-[#FDE006] px-6 py-3 rounded-full cursor-pointer hover:bg-[#e6cc05] transition-all">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
