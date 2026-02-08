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

function Chart({
  title = "Gross volume",
  value,
  data = [0, 0, 0, 0, 0, 0, 0],
  labels = ["Feb 2", "Feb 3", "Feb 4", "Feb 5", "Feb 6", "Feb 7", "Feb 8"],
}: ChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: "#9333ea", // Purple 600
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: { color: "#71717a", font: { size: 10 } },
      },
      y: {
        display: true,
        position: "right",
        grid: { display: false },
        ticks: { color: "#71717a", font: { size: 10 }, stepSize: 0.01 },
      },
    },
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 hover:border-purple-500/50 transition-colors shadow-sm">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="text-zinc-500 text-xs font-medium uppercase flex items-center gap-1">
            {title} <span className="opacity-50 text-[10px]">ⓘ</span>
          </h3>
          <p className="text-white text-xl font-bold mt-1">{value}</p>
        </div>
      </div>
      <div className="h-[120px] mt-4">
        <Line data={chartData} options={options as any} />
      </div>
    </div>
  );
}

export default Chart;
