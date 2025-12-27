import React from "react";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import SAMPLE from "../../../assets/image 8.png";
import { FaCheck } from "react-icons/fa";
import Footer from "../../../components/Footer";
import Layout from "../../../components/Layout";
import ProductCard, { type ProductCardProps } from "./components/ProductCard";
import OrderSummary from "./components/OrderSummary";

const index = () => {
  const items: ProductCardProps[] = [
    {
      name: "BSCS UNIFORM",
      size: "M",
      quantity: 1,
      price: 800,
    },
  ];
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Layout>
      <AuthenticatedNav />
      <div className="w-full">
        <div className="flex justify-between gap-4">
          <div className="w-full">
            <ProductCard
              name="BSCS UNIFORM"
              size="M"
              quantity={1}
              price={800}
            />
          </div>

          <OrderSummary items={items} totalPrice={totalPrice} />
        </div>
      </div>
    </Layout>
  );
};

export default index;
