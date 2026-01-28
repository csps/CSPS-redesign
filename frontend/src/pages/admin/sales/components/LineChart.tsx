import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

const LineChart = () => {
  const labels = ["Week 1", "Week 2", "Week 3", "Week 4"];

  const data = {
    labels,
    datasets: [
      {
        data: [260, 80, 180, 240],
        borderColor: "#FFD54A",
        borderWidth: 3,
        tension: 0.45,
        pointRadius: 0,
        fill: true,
        backgroundColor: (context: { chart: { ctx: any; chartArea: any } }) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );

          gradient.addColorStop(0, "rgba(255, 213, 74, 0.35)");
          gradient.addColorStop(1, "rgba(255, 213, 74, 0)");

          return gradient;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#2A1465",
        titleColor: "#fff",
        bodyColor: "#FFD54A",
        displayColors: false,
        callbacks: {
          label: (ctx: { raw: any }) => `₱${ctx.raw}.00`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#BFAFFF" },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "#BFAFFF" },
      },
    },
  };

  return (
    <div
      style={{
        height: 320,
        borderRadius: 16,
      }}
    >
      <h3 style={{ color: "#fff", marginBottom: 4 }}>Total Sales</h3>
      <h1 style={{ color: "#FFD54A", marginTop: 0 }}>₱7,666.00</h1>

      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
