import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// 🌈 Color palette for charts
const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
  "#EC4899",
  "#8B5CF6",
  "#14B8A6",
];

export default function AnalyticsPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [data, setData] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await api.get(`/analysis/${userId}`);
      setData(res.data.data);
    } catch (err) {
      console.error("Analytics error:", err);
    }
  };

  if (!data) return <p className="text-center mt-10">Loading analytics...</p>;

  const weekly = data.weekly_trends;
  const category = data.category_stats;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-6 space-y-10">
      <h1 className="text-4xl font-bold text-gray-900">
        Food Analysis Dashboard
      </h1>

      {/* Score Box */}
      <div className="p-6 bg-green-50 border border-green-300 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-green-700">
          Sustainability Score
        </h2>
        <p className="text-4xl font-bold mt-2 text-green-900">
          {data.user_score} / 100
        </p>
      </div>

      {/* Weekly Trends Chart */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">
          Weekly Consumption Trends
        </h2>

        <div className="bg-white p-6 shadow rounded-xl">
          <Bar
            data={{
              labels: Object.keys(weekly),
              datasets: [
                {
                  label: "Units Consumed",
                  data: Object.values(weekly),
                  backgroundColor: COLORS, // 🌈 colorful bars
                },
              ],
            }}
          />
        </div>
      </section>

      {/* Category Chart */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Category Breakdown</h2>

        <div className="bg-white p-6 shadow rounded-xl w-full max-w-lg mx-auto">
          <Pie
            data={{
              labels: Object.keys(category),
              datasets: [
                {
                  data: Object.values(category),
                  backgroundColor: COLORS, // 🌈 colorful pie segments
                },
              ],
            }}
          />
        </div>
      </section>

      {/* Alerts */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Health & Intake Alerts</h2>
        <div className="space-y-3">
          {data.alerts.length > 0 ? (
            data.alerts.map((a, i) => (
              <div
                key={i}
                className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded"
              >
                <p className="font-semibold text-yellow-700">{a.message}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No alerts — you're doing great!</p>
          )}
        </div>
      </section>

      {/* Waste Predictions */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Waste Predictions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {data.waste_predictions.length > 0 ? (
            data.waste_predictions.map((wp, i) => (
              <div
                key={i}
                className="p-5 bg-red-50 border border-red-300 rounded-xl shadow"
              >
                <h3 className="font-bold text-red-700">{wp.item}</h3>
                <p className="text-gray-700">Expires in: {wp.daysLeft} days</p>
                <p className="text-red-600 mt-2">{wp.message}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No items predicted to be wasted.</p>
          )}
        </div>
      </section>
    </div>
  );
}
