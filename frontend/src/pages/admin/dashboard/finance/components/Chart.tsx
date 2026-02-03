import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// Chart Options for customization
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#1e1b3a",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#facc15",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#c7c7d1",
        font: { size: 11 },
      },
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        color: "#c7c7d1",
        font: { size: 11 },
      },
      grid: {
        color: "rgba(255,255,255,0.08)",
      },
    },
  },
};

// Labels for the chart (days of the week)
const labels = ["Mo", "Tu", "We", "Th", "Fr", "Sat", "Sun"];

interface ChartProps {
  data?: number[];
}

// Chart component
export function Chart({
  data: chartDataValues = [150, 180, 120, 210, 250, 180, 190],
}: ChartProps) {
  const [timeRange, setTimeRange] = useState("7 days"); // Track selected time range

  // Build chart data dynamically
  const data = {
    labels,
    datasets: [
      {
        data: chartDataValues,
        borderColor: "rgb(255, 221, 51)", // Yellow line color
        backgroundColor: "rgba(255, 221, 51, 0.5)", // Slightly transparent yellow
        tension: 0.4,
      },
    ],
  };

  // Handle change in dropdown selection
  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setTimeRange(event.target.value);
    // You can add logic here to adjust the chart data based on the selected time range
    // For example, changing the data for '30 days', etc.
  };

  return (
    <div style={{ padding: "10px", fontFamily: "Arial, sans-serif" }}>
      {" "}
      {/* Adjusted container width */}
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: "14px" }}>Total Orders 8</h3>{" "}
        {/* Smaller font size for header */}
        <select
          value={timeRange}
          onChange={handleDropdownChange}
          style={{ padding: "3px", fontSize: "12px" }}
        >
          {" "}
          {/* Smaller font size for dropdown */}
          <option value="7 days">7 days</option>
          <option value="30 days">30 days</option>
          <option value="90 days">90 days</option>
        </select>
      </div>
      {/* Line Chart */}
      <div style={{ marginTop: "10px" }}>
        {" "}
        {/* Smaller chart container */}
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
