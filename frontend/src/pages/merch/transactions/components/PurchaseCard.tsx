import { memo } from "react";
import type { OrderResponse } from "../../../../interfaces/order/OrderResponse";
import { MerchType } from "../../../../enums/MerchType";
import { OrderStatus } from "../../../../enums/OrderStatus";
import { S3_BASE_URL } from "../../../../constant";
import SAMPLE from "../../../../assets/image 8.png";

export const statusStyles = {
  [OrderStatus.CLAIMED]: {
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  [OrderStatus.TO_BE_CLAIMED]: {
    color: "text-[#FDE006]",
    bg: "bg-[#FDE006]/10",
    border: "border-[#FDE006]/20",
  },
  [OrderStatus.PENDING]: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
};

const statusLabels = {
  [OrderStatus.CLAIMED]: "Claimed",
  [OrderStatus.TO_BE_CLAIMED]: "Ready for Pickup",
  [OrderStatus.PENDING]: "Processing",
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
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 bg-[#1E1E3F] p-4 sm:p-5 border border-white/5 l"
          >
            {/* Image Container: Square on mobile, sized for row on desktop */}
            <div className="shrink-0 w-full sm:w-32 sm:h-32 md:w-40 md:h-40 aspect-square sm:aspect-auto bg-[#1E1E3F] rounded-xl sm:rounded-[2rem] flex items-center justify-center p-2 sm:p-4 overflow-hidden border border-white/5">
              <img
                src={item.s3ImageKey ? S3_BASE_URL + item.s3ImageKey : SAMPLE}
                alt={item.merchName}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Info Content */}
            <div className="flex flex-col flex-1 w-full py-1">
              <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-2 sm:gap-0">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    CSPS OFFICIAL • {item.merchType}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {item.merchName}
                  </h3>

                  {/* Status Badge */}
                  <div className="pt-1 sm:pt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}
                    >
                      {statusLabels[item.orderStatus as OrderStatus]}
                    </span>
                  </div>
                </div>

                {/* Price & Quantity */}
                <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-end sm:items-end mt-2 sm:mt-0">
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    ₱{item.totalPrice.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>

              {/* Row Footer with Details: Wraps on mobile, stays single line on desktop */}
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-400">
                {isClothing && (
                  <>
                    <p className="text-[11px] font-medium uppercase">
                      Size:{" "}
                      <span className="text-white font-bold">
                        {item.size || "N/A"}
                      </span>
                    </p>
                    <p className="text-[11px] font-medium uppercase">
                      Color:{" "}
                      <span className="text-white font-bold">{item.color}</span>
                    </p>
                  </>
                )}
                <p className="text-[11px] font-medium uppercase">
                  Date:{" "}
                  <span className="text-white font-bold">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-[11px] font-medium uppercase ml-0 sm:ml-auto">
                  ID: <span className="text-white/40">#{purchase.orderId}</span>
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
