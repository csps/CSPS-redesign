import React, { memo } from "react";
import type { PurchaseResponse } from "../../../../interfaces/purchase/PurchaseResponse";
import { PurchaseItemStatus } from "../../../../enums/PurchaseItemStatus";
import { MerchType } from "../../../../enums/MerchType";

const statusStyles = {
  [PurchaseItemStatus.CLAIMED]: {
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
  },
  [PurchaseItemStatus.NOT_PAID]: {
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  [PurchaseItemStatus.TO_BE_CLAIMED]: {
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
  },
};

const statusLabels = {
  [PurchaseItemStatus.CLAIMED]: "Claimed",
  [PurchaseItemStatus.NOT_PAID]: "Not paid",
  [PurchaseItemStatus.TO_BE_CLAIMED]: "To be claimed",
};

interface PurchaseCardProps {
  purchase: PurchaseResponse;
}

const PurchaseCard = memo(({ purchase }: PurchaseCardProps) => {
  return (
    <>
      {purchase.items.map((item, index) => {
        const variant = item.items;
        const isClothing = item.merchType === MerchType.CLOTHING;
        const statusStyle =
          statusStyles[item.status as PurchaseItemStatus] ||
          statusStyles[PurchaseItemStatus.NOT_PAID];

        return (
          <div
            key={`${purchase.purchaseId}-${index}`}
            className={`flex w-full  bg-white/10 justify-between items-center p-6 md:p-10 rounded-3xl transition-all duration-300`}
          >
            <div className="flex justify-center shrink-0">
              <div className="w-[120px] sm:w-[150px] md:w-[180px] h-[180px] bg-gray-600 rounded flex items-center justify-center text-xs text-center px-2">
                {item.merchType}
              </div>
            </div>

            <div className="flex flex-col items-end text-right">
              <div>
                <p className="text-lg sm:text-xl lg:text-3xl font-bold tracking-tight">
                  {item.merchName}
                </p>
                <p className="text-sm sm:text-lg text-purple-300">
                  Quantity: x{item.quantity}
                </p>

                {isClothing ? (
                  <div>
                    <p className="text-sm sm:text-lg text-gray-400">
                      Size: {variant?.size || "N/A"}
                    </p>
                    <p className="text-sm sm:text-lg text-gray-400">
                      Color: {variant?.color}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm sm:text-lg text-gray-400">
                    Design: {variant?.design}
                  </p>
                )}

                <p className="text-sm sm:text-lg">
                  ₱{variant?.price.toLocaleString()}
                </p>
              </div>

              <div className="mt-4 md:mt-8">
                <p className="text-sm lg:text-xl text-gray-400">
                  Total Price: ₱{purchase.totalPrice.toLocaleString()}
                </p>
                <p className="text-2xl font-medium text-white mb-2">
                  Status:{" "}
                  <span className={statusStyle.color}>
                    {statusLabels[item.status as PurchaseItemStatus] ||
                      "Unknown"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
});

PurchaseCard.displayName = "PurchaseCard";
export { PurchaseCard };
