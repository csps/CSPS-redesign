import React, { useEffect, useState, useMemo } from "react";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import Footer from "../../../components/Footer";
import { getPurchaseByStudent } from "../../../api/purchase";
import type { PurchaseResponse } from "../../../interfaces/purchase/PurchaseResponse";
import { PurchaseItemStatus } from "../../../enums/PurchaseItemStatus";
import { PurchaseCard } from "./components/PurchaseCard";
import { PurchaseFilter } from "./components/PurchaseFilter";

interface GroupedPurchases {
  [date: string]: PurchaseResponse[];
}

const statusLabels = {
  [PurchaseItemStatus.CLAIMED]: "Claimed",
  [PurchaseItemStatus.NOT_PAID]: "Not paid",
  [PurchaseItemStatus.TO_BE_CLAIMED]: "To be claimed",
};

const index = () => {
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Fetch purchases on component mount
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const data = await getPurchaseByStudent();
        setPurchases(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch purchases:", err);
        setError("Failed to load purchases. Please try again later.");
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  // Group purchases by date and filter by status
  const groupedPurchases = useMemo(() => {
    const filtered =
      selectedStatus === "All"
        ? purchases
        : purchases.filter((purchase) =>
            purchase.items.some(
              (item) =>
                (selectedStatus === PurchaseItemStatus.NOT_PAID &&
                  item.status === PurchaseItemStatus.NOT_PAID) ||
                (selectedStatus === PurchaseItemStatus.CLAIMED &&
                  item.status === PurchaseItemStatus.CLAIMED) ||
                (selectedStatus === PurchaseItemStatus.TO_BE_CLAIMED &&
                  item.status === PurchaseItemStatus.TO_BE_CLAIMED)
            )
          );

    const grouped: GroupedPurchases = {};
    filtered.forEach((purchase) => {
      const date = new Date(purchase.purchasedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(purchase);
    });

    return grouped;
  }, [purchases, selectedStatus]);

  // Get available statuses for filter dropdown
  const availableStatuses = useMemo(() => {
    const statuses = new Set<string>(["All"]);
    purchases.forEach((purchase) => {
      purchase.items.forEach((item) => {
        statuses.add(item.status);
      });
    });
    return Array.from(statuses);
  }, [purchases]);

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
        <div className="relative w-full max-w-[90rem] p-6 text-white">
          <AuthenticatedNav />

          <div className="mt-8">
            {/* Filter Section */}
            <PurchaseFilter
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading &&
              !error &&
              Object.keys(groupedPurchases).length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No purchases found</p>
                </div>
              )}

            {/* Purchases Grouped by Date */}
            {!loading &&
              !error &&
              Object.entries(groupedPurchases).map(([date, purchaseList]) => (
                <div key={date} className="mb-8">
                  <div className="px-4 mb-4">
                    <p className="text-lg font-semibold text-gray-300">
                      {date}
                    </p>
                  </div>
                  <div className="px-4 space-y-5">
                    {purchaseList.map((purchase) => (
                      <PurchaseCard
                        key={purchase.purchaseId}
                        purchase={purchase}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default index;
