import React from "react";
import SAMPLE from "../../../../assets/image 8.png";

export type ProductCardProps = {
  name: string;
  size: string;
  quantity: number;
  price: number;
  imageSrc?: string;
};

const ProductCard = ({
  name,
  size,
  quantity,
  price,
  imageSrc,
}: ProductCardProps) => {
  return (
    <div className="flex  items-center gap-2">
      <button className="w-10 h-5 border border-white active:bg-white"></button>

      <div className="flex w-full  bg-white/10 justify-between items-center p-6 md:p-10 rounded-3xl">
        <div className="flex justify-center w-full sm:w-auto mb-4 sm:mb-0">
          <img
            src={SAMPLE}
            alt=""
            className="w-[150px] sm:w-[180px] md:w-[200px] h-auto"
          />
        </div>

        <div className="flex flex-col items-end w-full sm:w-auto text-right">
          <div>
            <p className="text-xs sm:text-sm md:text-xl lg:text-3xl font-semibold">
              {name}
            </p>
            <p className="text-xs sm:text-sm md:text-lg lg:text-xl">
              x{quantity}
            </p>
            <p className="text-xs sm:text-sm md:text-lg lg:text-xl">
              Size: {size}
            </p>
            <p className="text-xs sm:text-sm md:text-lg lg:text-xl">₱{price}</p>
          </div>

          <div className="mt-4 md:mt-10 text-xs sm:text-sm md:text-lg lg:text-2xl">
            <p>Total Price: ₱{price * quantity}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
