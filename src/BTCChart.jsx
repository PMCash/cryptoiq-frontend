import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

function BTCChart({ history }) {
  const data = {
    labels: history.map(() => ""), // clean sparkline style (no labels)
    datasets: [
      {
        label: "BTC Price",
        data: history,
        borderColor: "#ffd700",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.35, // smooth candle-style curve
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // IMPORTANT for fixed height containers
    animation: {
      duration: 300,
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false, // disable tooltip for CLEAN sparkline look
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "80px", marginTop: "10px" }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default BTCChart;
