import api from "./api";
import type { OrderResponse } from "../interfaces/order/OrderResponse";

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

/**
 * Print a single transaction summary/receipt
 */
export const printSingleTransaction = (transaction: Transaction): void => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print the summary.");
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Transaction Receipt - #${transaction.id}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; line-height: 1.6; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .receipt-container { max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { text-align: center; border-bottom: 2px solid #41169C; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #41169C; margin: 0; font-size: 24px; }
        .header p { color: #666; margin: 5px 0 0; font-size: 14px; }
        .info-grid { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 30px; }
        .info-item { flex: 1 1 200px; margin-bottom: 5px; }
        .info-label { font-size: 11px; color: #999; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
        .info-value { font-size: 16px; color: #111; font-weight: 500; }
        .amount-section { background: #f8f7ff; padding: 20px; border-radius: 8px; text-align: right; margin-top: 20px; }
        .amount-total { font-size: 28px; font-weight: bold; color: #41169C; }
        .status-badge { display: inline-block; padding: 4px 12px; font-size: 12px; font-weight: bold; text-transform: uppercase; border-radius: 20px; }
        .status-CLAIMED { background: #e6fffa; color: #059669; border: 1px solid #b2f5ea; }
        .status-PENDING { background: #fffaf0; color: #d97706; border: 1px solid #fbd38d; }
        .status-REJECTED { background: #fff5f5; color: #dc2626; border: 1px solid #feb2b2; }
        .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
        @media print { 
          body { padding: 0; }
          .receipt-container { border: none; box-shadow: none; max-width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="header">
          <h1>CSPS Transaction Receipt</h1>
          <p>Computer Science and Physics Society</p>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Transaction ID</div>
            <div class="info-value">#${transaction.id}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Order ID</div>
            <div class="info-value">#${transaction.orderId}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Date</div>
            <div class="info-value">${new Date(transaction.date).toLocaleDateString()}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value"><span class="status-badge status-${transaction.status}">${transaction.status === "CLAIMED" ? "Approved" : transaction.status}</span></div>
          </div>
        </div>

        <div class="info-item" style="border-top: 1px dashed #eee; padding-top: 20px;">
          <div class="info-label">Student Name</div>
          <div class="info-value">${transaction.studentName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">ID Number</div>
          <div class="info-value">${transaction.idNumber}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Membership Type</div>
          <div class="info-value">${transaction.membershipType}</div>
        </div>

        <div class="amount-section">
          <div class="info-label">Total Amount Paid</div>
          <div class="amount-total">₱${transaction.amount.toLocaleString()}</div>
        </div>

        <div class="footer">
          <p>Thank you for your transaction!</p>
          <p>&copy; ${new Date().getFullYear()} CSPS - Computer Science and Physics Society</p>
        </div>
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

/**
 * Print a detailed order summary including items
 */
export const printOrderSummary = (order: OrderResponse): void => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print the summary.");
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order Summary - #${order.orderId}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; line-height: 1.6; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .summary-container { max-width: 800px; margin: 0 auto; border: 1px solid #eee; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { text-align: center; border-bottom: 2px solid #41169C; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #41169C; margin: 0; font-size: 24px; }
        .header p { color: #666; margin: 5px 0 0; font-size: 14px; }
        .info-grid { display: flex; flex-wrap: wrap; gap: 30px; margin-bottom: 30px; }
        .info-item { flex: 1 1 150px; }
        .info-label { font-size: 11px; color: #999; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
        .info-value { font-size: 16px; color: #111; font-weight: 500; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { text-align: left; font-size: 12px; color: #999; text-transform: uppercase; padding: 10px; border-bottom: 2px solid #eee; font-weight: bold; }
        td { padding: 15px 10px; border-bottom: 1px solid #eee; font-size: 14px; vertical-align: top; }
        .total-section { text-align: right; margin-top: 30px; padding-top: 20px; border-top: 2px solid #41169C; }
        .total-label { font-size: 14px; color: #666; text-transform: uppercase; font-weight: bold; }
        .total-amount { font-size: 28px; font-weight: bold; color: #41169C; }
        .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
        @media print { body { padding: -100; } .summary-container { border: none; box-shadow: none; width: 100%; max-width: 100%; } }
      </style>
    </head>
    <body>
      <div class="summary-container">
        <div class="header">
          <h1>CSPS Order Summary</h1>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Order ID</div>
            <div class="info-value">#${order.orderId}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Date</div>
            <div class="info-value">${new Date(order.orderDate).toLocaleDateString()}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Customer Name</div>
            <div class="info-value">${order.studentName}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th>Quantity</th>
              <th style="text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.orderItems
              .map(
                (item) => `
              <tr>
                <td>
                  <div style="font-weight: bold;">${item.merchName}</div>
                  <div style="font-size: 12px; color: #666;">
                    ${item.merchType} ${item.size ? `• Size: ${item.size}` : ""} ${item.color ? `• Color: ${item.color}` : ""}
                  </div>
                </td>
                <td>${item.quantity}</td>
                <td style="text-align: right;">₱${item.totalPrice.toLocaleString()}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div class="total-section">
          <span class="total-label">Grand Total:</span>
          <div class="total-amount">₱${order.totalPrice.toLocaleString()}</div>
        </div>

        <div class="footer">
          <p>This is a computer-generated summary.</p>
          <p>&copy; ${new Date().getFullYear()} CSPS</p>
        </div>
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
