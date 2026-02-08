import api from "./api";

// ==================== Types ====================

export type TransactionStatus = "PENDING" | "CLAIMED" | "REJECTED";

export interface ChartPoint {
  label: string;
  value: number;
}

export interface SalesStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalSales: number;
    currency: string;
    chartData: ChartPoint[];
  };
}

export interface SalesStats {
  totalSales: number;
  currency: string;
  labels: string[];
  data: number[];
}

export interface Transaction {
  id: number;
  orderId: number;
  studentId: string;
  studentName: string;
  idNumber: string;
  membershipType: string;
  amount: number;
  date: string;
  status: TransactionStatus;
}

export interface TransactionPageResponse {
  success: boolean;
  message: string;
  data: {
    content: Transaction[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export interface TransactionParams {
  page?: number;
  size?: number;
  search?: string;
  status?: TransactionStatus;
  year?: number;
}

// ==================== API Functions ====================

/**
 * Get sales statistics for chart display
 * @param period - "WEEKLY", "MONTHLY", or "YEARLY"
 */
export const getSalesStats = async (
  period: string = "WEEKLY",
): Promise<SalesStats> => {
  const response = await api.get<SalesStatsResponse>("/sales/stats", {
    params: { period },
  });

  // Transform API response to frontend format
  const { totalSales, currency, chartData } = response.data.data;
  return {
    totalSales,
    currency,
    labels: chartData.map((point) => point.label),
    data: chartData.map((point) => point.value),
  };
};

/**
 * Get paginated transactions with optional filters
 */
export const getTransactions = async (
  params: TransactionParams,
): Promise<TransactionPageResponse["data"]> => {
  const response = await api.get<TransactionPageResponse>(
    "/sales/transactions",
    {
      params,
    },
  );
  return response.data.data;
};

/**
 * Approve a pending transaction (changes status to CLAIMED)
 */
export const approveTransaction = async (id: number): Promise<Transaction> => {
  const response = await api.post<{ success: boolean; data: Transaction }>(
    `/sales/transactions/${id}/approve`,
  );
  return response.data.data;
};

/**
 * Reject a transaction (changes status to CANCELLED)
 */
export const rejectTransaction = async (id: number): Promise<void> => {
  await api.delete(`/sales/transactions/${id}`);
};

/**
 * Get full transaction history (all transactions)
 */
export const getFullHistory = async (): Promise<Transaction[]> => {
  const response = await api.get<TransactionPageResponse>(
    "/sales/transactions",
    {
      params: { page: 0, size: 1000 },
    },
  );
  return response.data.data.content;
};

/**
 * Export transactions as CSV
 */
export const exportTransactionsCSV = (transactions: Transaction[]): void => {
  // CSV Header
  const headers = [
    "ID",
    "Student ID",
    "Student Name",
    "ID Number",
    "Membership",
    "Amount",
    "Date",
    "Status",
  ];

  // CSV Rows
  const rows = transactions.map((t) => [
    t.id,
    t.studentId,
    t.studentName,
    t.idNumber,
    t.membershipType,
    t.amount.toFixed(2),
    t.date,
    t.status,
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `sales_report_${new Date().toISOString().split("T")[0]}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Print transactions summary
 */
export const printTransactionsSummary = (
  transactions: Transaction[],
  totalSales: number,
): void => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print the summary.");
    return;
  }

  const statusCounts = {
    PENDING: transactions.filter((t) => t.status === "PENDING").length,
    CLAIMED: transactions.filter((t) => t.status === "CLAIMED").length,
    REJECTED: transactions.filter((t) => t.status === "REJECTED").length,
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sales Summary Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
        h1 { color: #41169C; border-bottom: 2px solid #41169C; padding-bottom: 10px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .stat { display: inline-block; margin-right: 40px; }
        .stat-value { font-size: 24px; font-weight: bold; color: #41169C; }
        .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #41169C; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
        .status-PENDING { color: #f59e0b; }
        .status-CLAIMED { color: #10b981; }
        .status-REJECTED { color: #ef4444; }
        .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <h1>CSPS Sales Summary Report</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      
      <div class="summary">
        <div class="stat">
          <div class="stat-value">₱${totalSales.toLocaleString()}</div>
          <div class="stat-label">Total Sales</div>
        </div>
        <div class="stat">
          <div class="stat-value">${transactions.length}</div>
          <div class="stat-label">Total Transactions</div>
        </div>
        <div class="stat">
          <div class="stat-value">${statusCounts.PENDING}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="stat">
          <div class="stat-value">${statusCounts.CLAIMED}</div>
          <div class="stat-label">Approved</div>
        </div>
        <div class="stat">
          <div class="stat-value">${statusCounts.REJECTED}</div>
          <div class="stat-label">Rejected</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>ID Number</th>
            <th>Membership</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${transactions
            .map(
              (t) => `
            <tr>
              <td>${t.id}</td>
              <td>${t.studentName}</td>
              <td>${t.idNumber}</td>
              <td>${t.membershipType}</td>
              <td>₱${t.amount.toLocaleString()}</td>
              <td>${new Date(t.date).toLocaleDateString()}</td>
              <td class="status-${t.status}">${t.status}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="footer">
        <p>Computer Science and Physics Society (CSPS)</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
};
