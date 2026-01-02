import React from "react";
import { Chart as ChartJS, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement);

// Center text plugin
const centerTextPlugin = {
  id: "centerText",
  beforeDraw(chart: { ctx: any; width: any; height: any; }) {
    const { ctx, width, height } = chart;

    ctx.save();

    // Subtitle
    ctx.font = "12px Inter, sans-serif";
    ctx.fillStyle = "#a5a5c9";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Computer Science Students",
      width / 2,
      height / 2 - 18
    );

    // Main value
    ctx.font = "bold 36px Inter, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("1000", width / 2, height / 2 + 10);

    ctx.restore();
  },
};

// Chart data (SOLID COLORS)
const data = {
  datasets: [
    {
      data: [75, 25], // progress vs remainder
      backgroundColor: [
        "#FDE006",           // yellow progress
        "#A000FF" // purple remainder
      ],
      borderWidth: 0,
      cutout: "85%",
    },
  ],
};

// Chart options
const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
};

// Component
export default function RadialChart() {
  return (
    <div
      style={{
        width: 260,
        height: 260,
        padding: 20,
      }}
    >
      <Doughnut
        data={data}
        options={options}
        plugins={[centerTextPlugin]}
      />
    </div>
  );
}
