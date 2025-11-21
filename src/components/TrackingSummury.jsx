import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  ListChecks,
  Clock,
  Lightbulb,
  TrendingUp,
  DollarSign,
} from "lucide-react"; // Importing icons

export default function TrackingSummary() {
  const userId = JSON.parse(localStorage.getItem("user")).id;

  const [summary, setSummary] = useState({
    totalInventory: 0,
    recentLogs: [],
    recommendations: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a slightly longer loading time for better UX demonstration
    setTimeout(() => {
      api
        .get(`/tracking/summary/${userId}`)
        .then((res) => {
          setSummary(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching tracking summary:", error);
          setLoading(false);
        });
    }, 500); // 500ms delay
  }, [userId]);

  // console.log(summary); // Kept the console log for development purposes

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-10 bg-white shadow-xl rounded-2xl border border-gray-100 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <TrendingUp className="w-10 h-10 text-green-500 mb-3" />
          <p className="text-lg font-medium text-gray-600">
            Analyzing your usage patterns...
          </p>
          <div className="h-2 bg-gray-200 rounded w-1/3 mt-4"></div>
        </div>
      </div>
    );
  }

  // Custom helper to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full p-8 bg-white shadow-2xl rounded-3xl border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-900 flex items-center">
          <TrendingUp className="w-7 h-7 mr-3 text-green-600" />
          Personalized Waste Tracking Insights
        </h2>

        {/* --- Key Metric Card (Inventory) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-md col-span-1">
            <div className="flex items-center space-x-3">
              <ListChecks className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-bold text-blue-800">
                Total Inventory
              </h3>
            </div>
            <p className="text-5xl font-extrabold text-blue-900 mt-4">
              {summary.totalInventory}
            </p>
            <p className="text-blue-600 mt-1">Items currently stocked</p>
          </div>
          {/* Placeholder for future metrics (e.g., Waste Score, Savings) */}
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl shadow-md col-span-1 opacity-70">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-yellow-600" />
              <h3 className="text-xl font-bold text-yellow-800">Waste Score</h3>
            </div>
            <p className="text-5xl font-extrabold text-yellow-900 mt-4">82%</p>
            <p className="text-yellow-600 mt-1">
              Use-it-up Efficiency (Placeholder)
            </p>
          </div>
          <div className="p-6 bg-green-50 border border-green-200 rounded-xl shadow-md col-span-1 opacity-70">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-bold text-green-800">
                Estimated Savings
              </h3>
            </div>
            <p className="text-5xl font-extrabold text-green-900 mt-4">$45</p>
            <p className="text-green-600 mt-1">This month (Placeholder)</p>
          </div>
        </div>

        {/* --- Recent Logs and Recommendations Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: Recent Consumption Logs */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center border-b pb-2">
              <Clock className="w-5 h-5 mr-2 text-gray-500" />
              Recent Consumption Logs
            </h3>

            {summary.recentLogs.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                <p className="text-gray-500 italic">
                  Start logging consumption on the Daily Log page to see history
                  here.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {summary.recentLogs.slice(0, 5).map((log) => (
                  <li
                    key={log._id}
                    className="p-4 bg-white border-l-4 border-green-500 shadow rounded-lg flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-semibold text-lg text-gray-900 capitalize">
                        {log.itemName || "Unnamed item"}
                      </p>
                      <p className="text-gray-500 text-sm capitalize mt-0.5">
                        {log.category}
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm font-medium">
                      {formatDate(log.consumedAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Column 2: Recommendations */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center border-b pb-2">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Personalized Recommendations
            </h3>

            {summary.recommendations.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                <p className="text-gray-500 italic">
                  No recommendations yet. Log more items and usage to generate
                  insights!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {summary.recommendations.slice(0, 3).map((res) => (
                  <div
                    key={res._id}
                    className="p-5 border-l-4 border-yellow-500 rounded-lg bg-yellow-50 shadow-sm"
                  >
                    <h4 className="font-bold text-yellow-800 text-lg flex items-center">
                      {res.title}
                    </h4>

                    <p className="text-gray-700 mt-1 line-clamp-2">
                      {res.description}
                    </p>

                    {res.url && (
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm block mt-2 font-medium"
                      >
                        View Resource →
                      </a>
                    )}

                    <p className="text-sm text-yellow-700 mt-3 border-t pt-2 border-yellow-200 italic">
                      * {res.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
