import { memo } from "react";
import type { OrderResponse } from "../../../../interfaces/order/OrderResponse";
import { MerchType } from "../../../../enums/MerchType";
import { OrderStatus } from "../../../../enums/OrderStatus";
import { S3_BASE_URL } from "../../../../constant";
import SAMPLE from "../../../../assets/image 8.png";

export const statusStyles = {
  [OrderStatus.CLAIMED]: {
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  [OrderStatus.TO_BE_CLAIMED]: {
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  [OrderStatus.PENDING]: {
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  [OrderStatus.REJECTED]: {
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
};

const statusLabels = {
  [OrderStatus.CLAIMED]: "Claimed",
  [OrderStatus.TO_BE_CLAIMED]: "Ready for Pickup",
  [OrderStatus.PENDING]: "Processing",
  [OrderStatus.REJECTED]: "Rejected",
};

interface PurchaseCardProps {
  purchase: OrderResponse;
}

const PurchaseCard = memo(({ purchase }: PurchaseCardProps) => {
  return (
    <div className="space-y-4">
      {purchase.orderItems.map((item, index) => {
        const isClothing = item.merchType === MerchType.CLOTHING;
        const statusStyle = statusStyles[item.orderStatus as OrderStatus];

        return (
          <div
            key={`${purchase.orderId}-${index}`}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 bg-[#1E1E3F] p-4 sm:p-5 border border-white/10 rounded-xl"
          >
            {/* Image Container */}
            <div className="shrink-0 w-full sm:w-32 sm:h-32 md:w-40 md:h-40 bg-black/20 rounded-lg flex items-center justify-center p-2 overflow-hidden border border-white/5">
              <img
                src={item.s3ImageKey ? S3_BASE_URL + item.s3ImageKey : SAMPLE}
                alt={item.merchName}
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            {/* Info Content */}
            <div className="flex flex-col flex-1 w-full py-1">
              <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-2 sm:gap-0">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">
                    CSPS Official • {item.merchType}
                  </p>
                  {/* BOLDED: Product Name */}
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {item.merchName}
                  </h3>

                  {/* Status Badge */}
                  <div className="pt-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-bold border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}
                    >
                      {statusLabels[item.orderStatus as OrderStatus]}
                    </span>
                  </div>
                </div>

                {/* Price & Quantity */}
                <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-end mt-2 sm:mt-0">
                  {/* BOLDED: Price */}
                  <p className="text-xl font-bold text-white">
                    ₱{item.totalPrice.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    Qty:{" "}
                    <span className="font-bold text-gray-200">
                      {item.quantity}
                    </span>
                  </p>
                </div>
              </div>

              {/* Row Footer with Details */}
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                {isClothing && (
                  <>
                    <p>
                      Size:{" "}
                      <span className="font-bold text-white">
                        {item.size || "N/A"}
                      </span>
                    </p>
                    <p>
                      Color:{" "}
                      <span className="font-bold text-white">{item.color}</span>
                    </p>
                  </>
                )}
                <p>
                  Date:{" "}
                  <span className="font-bold text-white">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p className="ml-0 sm:ml-auto text-xs text-gray-500">
                  ID: <span>#{purchase.orderId}</span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

PurchaseCard.displayName = "PurchaseCard";
export { PurchaseCard };
