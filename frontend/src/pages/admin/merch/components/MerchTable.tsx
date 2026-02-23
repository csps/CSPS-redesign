import React from "react";
import type { MerchDetailedResponse } from "../../../../interfaces/merch/MerchResponse";

interface MerchTableProps {
  items: MerchDetailedResponse[];
  onRevert?: (merchId: number) => void;
  showRevertButton?: boolean;
}

const MerchTable: React.FC<MerchTableProps> = ({
  items,
  onRevert,
  showRevertButton = false,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-left text-sm text-gray-400">
        <thead className="bg-[#1E1E3F] text-xs uppercase text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Variants
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-[#1E1E3F]/40">
          {items.map((item) => (
            <tr key={item.merchId} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 font-medium text-white">
                #{item.merchId}
              </td>
              <td className="px-6 py-4 font-medium text-white">
                {item.merchName}
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-400/20">
                  {item.merchType}
                </span>
              </td>
              <td className="px-6 py-4 text-white">
                ₱{item.basePrice.toFixed(2)}
              </td>
              <td className="px-6 py-4">{item.variants?.length || 0}</td>
              <td className="px-6 py-4 text-right space-x-2">
                {showRevertButton && onRevert && (
                  <button
                    onClick={() => onRevert(item.merchId)}
                    className="inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-500 transition-colors"
                  >
                    Revert
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MerchTable;
