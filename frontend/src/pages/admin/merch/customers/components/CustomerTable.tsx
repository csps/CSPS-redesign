import React from "react";
import type { MerchCustomerResponse } from "../../../../../interfaces/merch_customer/MerchCustomerResponse";
import type { PaginatedResponse } from "../../../../../interfaces/paginated";
import Pagination from "../../../../../components/Pagination";
import { S3_BASE_URL } from "../../../../../constant";

/**
 * Data table for displaying merch customers with columns for student info,
 * variant details, quantity, total price, status, date, and image thumbnail.
 * Includes loading skeleton, empty state, and hover highlights.
 *
 * @param data - paginated response containing merch customer records
 * @param loading - whether data is being fetched
 * @param currentPage - current zero-based page index
 * @param onPageChange - callback when the page changes
 */

interface CustomerTableProps {
  data: PaginatedResponse<MerchCustomerResponse> | null;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// status badge color mapping
const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  TO_BE_CLAIMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  CLAIMED: "bg-green-500/10 text-green-400 border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
};

/**
 * Formats an order status string into a readable label.
 * e.g. "TO_BE_CLAIMED" → "To Be Claimed"
 */
const formatStatus = (status: string): string =>
  status
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");

/**
 * Formats an ISO date string into a short readable date.
 */
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Builds a variant label from design, color, and size fields.
 */
const buildVariantLabel = (
  design?: string | null,
  color?: string | null,
  size?: string | null,
): string => {
  return [design, color, size].filter(Boolean).join(" / ") || "—";
};

// skeleton row for loading state
const SkeletonRow: React.FC = () => (
  <tr className="border-b border-zinc-800">
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-4 bg-zinc-800/80 rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

const CustomerTable: React.FC<CustomerTableProps> = ({
  data,
  loading,
  currentPage,
  onPageChange,
}) => {
  const customers = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const from = currentPage * (data?.size ?? 7) + 1;
  const to = Math.min(from + (data?.numberOfElements ?? 0) - 1, totalElements);

  // empty state
  if (!loading && customers.length === 0) {
    return (
      <div className="bg-[#110e31]  border border-zinc-800 rounded-xl p-16 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-zinc-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.5-1.632Z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          No Customers Found
        </h3>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          No customers match your current filters. Try adjusting your search or
          status filter.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#110e31]  rounded-xl border border-zinc-800 overflow-hidden shadow-sm">
      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-zinc-800 bg-[#110e31] ">
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase">
                Student
              </th>
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase">
                Year
              </th>
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase">
                Variant
              </th>
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase text-center">
                Qty
              </th>
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase text-right">
                Total
              </th>
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase text-center">
                Image
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : customers.map((c, i) => (
                  <tr
                    key={`${c.studentId}-${i}`}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    {/* student */}
                    <td className="px-4 py-4">
                      <p className="text-white font-medium">{c.studentName}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {c.studentId}
                      </p>
                    </td>

                    {/* year level */}
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-800 text-xs font-medium text-zinc-300">
                        {c.yearLevel}
                      </span>
                    </td>

                    {/* variant */}
                    <td className="px-4 py-4 text-zinc-300 text-xs">
                      {buildVariantLabel(c.design, c.color, c.size)}
                    </td>

                    {/* qty */}
                    <td className="px-4 py-4 text-center text-zinc-300">
                      {c.quantity}
                    </td>

                    {/* total */}
                    <td className="px-4 py-4 text-right text-white font-medium">
                      ₱
                      {c.totalPrice.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    {/* status */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          statusColors[c.orderStatus] ??
                          "bg-zinc-800/50 text-zinc-400 border-zinc-700"
                        }`}
                      >
                        {formatStatus(c.orderStatus)}
                      </span>
                    </td>

                    {/* date */}
                    <td className="px-4 py-4 text-zinc-400 text-xs whitespace-nowrap">
                      {formatDate(c.orderDate)}
                    </td>

                    {/* image */}
                    <td className="px-4 py-4 text-center">
                      {c.s3ImageKey ? (
                        <img
                          src={`${S3_BASE_URL}${c.s3ImageKey}`}
                          alt="variant"
                          className="w-10 h-10 rounded-lg object-cover mx-auto border border-zinc-700 shadow-sm"
                        />
                      ) : (
                        <span className="text-zinc-600 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* pagination footer */}
      {!loading && totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-zinc-800 gap-3 bg-[#110e31] ">
          <p className="text-xs text-zinc-500">
            Showing {from}-{to} of {totalElements}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
