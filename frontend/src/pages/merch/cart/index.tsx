import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import SAMPLE from "../../../assets/image 8.png";
// removed unused imports
import Layout from "../../../components/Layout";
import ProductCard, { type ProductCardProps } from "./components/ProductCard";
import OrderSummary from "./components/OrderSummary";
import { getCart } from "../../../api/cart";
import type { CartItemResponse } from "../../../interfaces/cart/CartItemResponse";

const index = () => {
  const [items, setItems] = useState<CartItemResponse[]>([]);
  // Use a Set for O(1) lookups and easy toggling
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const location = useLocation();

  // If navigated from Buy Now with a selected variant id, pre-select it
  useEffect(() => {
    const state = (location.state as any) || {};
    const id: number | undefined = state.selectedMerchVariantItemId;

    console.log(`Navigated with selectedMerchVariantId: ${id}`);
    if (id) {
      setSelectedIds(new Set([id]));
    }
  }, [location.state]);

  const fetchCart = async () => {
    const getCartResponse = await getCart();
    setItems(getCartResponse.items);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Toggle selection logic
  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Optimized derived state: Only recalculates when items or selection changes
  const { selectedItems, totalSelectedPrice } = useMemo(() => {
    const selected = items.filter((item) =>
      selectedIds.has(item.merchVariantItemId)
    );
    const total = selected.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    return { selectedItems: selected, totalSelectedPrice: total };
  }, [items, selectedIds]);

  return (
    <Layout>
      <AuthenticatedNav />
      <div className="w-full flex justify-between gap-8 px-4 py-8">
        <div className="w-full lg:max-w-7xl space-y-6">
          {items.map((item) => (
            <ProductCard
              key={item.merchVariantItemId}
              cartItem={item}
              isSelected={selectedIds.has(item.merchVariantItemId)}
              onToggle={() => toggleSelect(item.merchVariantItemId)}
            />
          ))}
        </div>

        {/* Pass the optimized total to OrderSummary */}
        <OrderSummary
          items={selectedItems}
          totalPrice={totalSelectedPrice}
          onOrderSuccess={() => {
            fetchCart();
            setSelectedIds(new Set());
          }}
        />
      </div>
    </Layout>
  );
};
export default index;
