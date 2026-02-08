import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
interface LineChartProps {
  data: number[];
  labels: string[];
  totalSales: number;
}
export default function LineChart({
  data,
  labels,
  totalSales,
}: LineChartProps) {
  // Transform data for Recharts
  const chartData = labels.map((label, index) => ({
    name: label,
    value: data[index] || 0,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="rgba(255,255,255,0.05)"
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "#9ca3af",
            fontSize: 12,
          }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "#9ca3af",
            fontSize: 12,
          }}
          tickFormatter={(value) => `₱${value}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-[#18181b] border border-purple-500/20 px-3 py-2 rounded-lg shadow-xl backdrop-blur-md">
                  <p className="text-gray-400 text-xs mb-1">{label}</p>
                  <p className="text-purple-400 text-sm font-bold">
                    ₱{Number(payload[0].value).toLocaleString()}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#9333ea"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorValue)"
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
