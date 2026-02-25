import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

interface ChartProps {
  title?: string;
  value?: string;
  data?: number[];
  labels?: string[];
}

/**
 * A sleek line chart component for displaying financial metrics and activity trends.
 * Features a minimalist design with a focus on readability and smooth transitions.
 * 
 * @param {ChartProps} props - The component props.
 * @returns {JSX.Element} The rendered line chart.
 */
function Chart({
  title = "Gross volume",
  value,
  data = [],
  labels = [],
}: ChartProps) {
  // Ensure we have data to display, fallback to zeros if empty
  const displayData = data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0];
  const displayLabels = labels.length > 0 ? labels : ["", "", "", "", "", "", ""];

  const chartData = {
    labels: displayLabels,
    datasets: [
      {
        data: displayData,
        borderColor: "#9333ea", // Purple 600
        borderWidth: 2,
        tension: 0.4, // Smooth curve
        pointRadius: 0,
        fill: true,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 120);
          gradient.addColorStop(0, "rgba(147, 51, 234, 0.1)");
          gradient.addColorStop(1, "rgba(147, 51, 234, 0)");
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
        mode: 'index',
        intersect: false,
        backgroundColor: '#18181b',
        titleColor: '#a1a1aa',
        bodyColor: '#ffffff',
        borderColor: '#27272a',
        borderWidth: 1,
        padding: 8,
        displayColors: false,
      }
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#71717a", font: { size: 10 } },
      },
      y: {
        display: true,
        position: "right",
        grid: { 
          color: "rgba(39, 39, 42, 0.5)",
          drawTicks: false,
        },
        border: { display: false, dash: [4, 4] },
        ticks: { 
          color: "#71717a", 
          font: { size: 10 },
          maxTicksLimit: 5,
          callback: (value: any) => {
            if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
            return value;
          }
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="bg-transparent transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            {title}
          </h3>
          <p className="text-white text-2xl font-bold mt-1 tracking-tight">
            {value || "—"}
          </p>
        </div>
      </div>
      <div className="h-[120px] w-full">
        {data.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center border border-dashed border-zinc-800 rounded-lg">
            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">No data available</span>
          </div>
        ) : (
          <Line data={chartData} options={options as any} />
        )}
      </div>
    </div>
  );
}

export default Chart;
