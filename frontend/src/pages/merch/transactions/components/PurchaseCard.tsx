import { memo } from "react";
import type { OrderResponse } from "../../../../interfaces/order/OrderResponse";
import { MerchType } from "../../../../enums/MerchType";
import { OrderStatus } from "../../../../enums/OrderStatus";
import { S3_BASE_URL } from "../../../../constant";

const statusStyles = {
  [OrderStatus.CLAIMED]: {
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
  },
  [OrderStatus.NOT_PAID]: {
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  [OrderStatus.TO_BE_CLAIMED]: {
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
  },
  [OrderStatus.PENDING]: {
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
};

const statusLabels = {
  [OrderStatus.CLAIMED]: "Claimed",
  [OrderStatus.NOT_PAID]: "Not paid",
  [OrderStatus.TO_BE_CLAIMED]: "To be claimed",
  [OrderStatus.PENDING]: "Pending",
};

interface PurchaseCardProps {
  purchase: OrderResponse;
}

const PurchaseCard = memo(({ purchase }: PurchaseCardProps) => {
  return (
    <>
      {purchase.orderItems.map((item, index) => {
        const isClothing = item.merchType === MerchType.CLOTHING;

        console.log("isClothing:", isClothing);
        const statusStyle =
          statusStyles[purchase.orderStatus as OrderStatus] ||
          statusStyles[OrderStatus.NOT_PAID];

        return (
          <div
            key={`${purchase.orderId}-${index}`}
            className={`flex w-full  bg-white/10 justify-between items-center p-6 md:p-10 rounded-3xl transition-all duration-300`}
          >
            <div className="flex justify-center shrink-0">
              <div className="w-[120px] sm:w-[150px] md:w-[180px] h-[180px] rounded flex items-center justify-center text-xs text-center px-2">
                <img
                  src={S3_BASE_URL + item.s3ImageKey}
                  alt={item.merchName}
                  className="max-w-full max-h-full"
                />
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
                      Size: {item.size || "N/A"}
                    </p>
                    <p className="text-sm sm:text-lg text-gray-400">
                      Color: {item.color}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm sm:text-lg text-gray-400">
                    Design: {item.design}
                  </p>
                )}

                <p className="text-sm sm:text-lg">
                  ₱{item.totalPrice.toLocaleString()}
                </p>
              </div>

              <div className="mt-4 md:mt-8">
                <p className="text-sm lg:text-xl text-gray-400">
                  Total Price: ₱{purchase.totalPrice.toLocaleString()}
                </p>
                <p className="text-2xl font-medium text-white mb-2">
                  Status:{" "}
                  <span className={statusStyle.color}>
                    {statusLabels[purchase.orderStatus as OrderStatus] ||
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
