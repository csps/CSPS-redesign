import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import Layout from "../../../components/Layout";
import ProductCard from "./components/ProductCard";
import OrderSummary from "./components/OrderSummary";
import { getCart } from "../../../api/cart";
import type { CartItemResponse } from "../../../interfaces/cart/CartItemResponse";

const Index = () => {
  const [items, setItems] = useState<CartItemResponse[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const state = (location.state as any) || {};
    const id: number | undefined = state.selectedMerchVariantItemId;
    if (id) {
      setSelectedIds(new Set([id]));
    }
  }, [location.state]);

  const fetchCart = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const getCartResponse = await getCart();
      setItems(getCartResponse.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const { selectedItems, totalSelectedPrice } = useMemo(() => {
    const selected = items.filter((item) =>
      selectedIds.has(item.merchVariantItemId),
    );
    const total = selected.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    return { selectedItems: selected, totalSelectedPrice: total };
  }, [items, selectedIds]);

  return (
    <Layout>
      <AuthenticatedNav />

      <div className="max-w-[90rem] mx-auto px-6 py-10 lg:py-16">
        {/* Page Header matching the inspiration hierarchy */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-white/40 mt-2 font-medium">
            {items.length} items in your bag
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* LEFT: Product List Area */}
          <div className="w-full lg:flex-[2] space-y-4">
            {loading ? (
              <div className="bg-[#242050]/50 border border-white/5 rounded-[2rem] py-24 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin mb-4" />
                <p className="text-white font-medium">Loading your cart...</p>
              </div>
            ) : items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.merchVariantItemId}
                  className="transition-all duration-300"
                >
                  <ProductCard
                    cartItem={item}
                    isSelected={selectedIds.has(item.merchVariantItemId)}
                    onToggle={() => toggleSelect(item.merchVariantItemId)}
                  />
                </div>
              ))
            ) : (
              <div className="bg-[#242050]/50 border border-white/5 rounded-[2rem] py-24 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">🛒</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Your cart is empty
                </h3>
                <p className="text-white/40 mt-2">
                  Looks like you haven't added anything yet.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary Sidebar (Sticky) */}
          <aside className="w-full lg:flex-1 lg:sticky lg:top-32">
            <OrderSummary
              items={selectedItems}
              totalPrice={totalSelectedPrice}
              onOrderSuccess={() => {
                fetchCart(true);
                setSelectedIds(new Set());
              }}
            />
          </aside>
        </div>
      </div>

      {/* Refreshing Modal */}
      {refreshing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#242050] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-12 h-12 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-medium text-lg">Refreshing cart...</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Index;
