import { useEffect, useState } from "react";
import api from "../api/axios";

export default function TrackingSummary() {
  const userId = JSON.parse(localStorage.getItem("user")).id;

  const [summary, setSummary] = useState({
    totalInventory: 0,
    recentLogs: [],
    recommendations: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/tracking/summary/${userId}`)
      .then((res) => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);
  console.log(summary);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">Loading summary...</p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Smart Food Tracking Summary
      </h2>

      {/* Inventory Summary */}
      <div className="p-4 bg-blue-50 border rounded-lg mb-8">
        <h3 className="text-lg font-semibold text-blue-700">
          Inventory Overview
        </h3>
        <p className="text-gray-700 mt-1">
          You currently have{" "}
          <span className="font-bold">{summary.totalInventory}</span> items in
          your inventory.
        </p>
      </div>

      {/* Recent Logs */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Recent Consumption Logs
        </h3>

        {summary.recentLogs.length === 0 ? (
          <p className="text-gray-500">No recent logs found.</p>
        ) : (
          <ul className="space-y-3">
            {summary.recentLogs.map((log) => (
              <li
                key={log._id}
                className="p-4 bg-gray-50 border rounded-lg flex justify-between"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {log.itemName || "Unnamed item"}
                  </p>
                  <p className="text-gray-500 text-sm capitalize">
                    Category: {log.category}
                  </p>
                </div>
                <p className="text-gray-600 text-sm">
                  {new Date(log.consumedAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Recommended Resources For You
        </h3>

        {summary.recommendations.length === 0 ? (
          <p className="text-gray-500">
            No recommendations right now — log more items to get suggestions!
          </p>
        ) : (
          <div className="space-y-5">
            {summary.recommendations.map((res) => (
              <div key={res._id} className="p-5 border rounded-lg bg-green-50">
                <h4 className="font-bold text-green-800 text-lg">
                  {res.title}
                </h4>

                <p className="text-gray-700 mt-1">{res.description}</p>

                {res.url && (
                  <a
                    href={res.url}
                    target="_blank"
                    className="text-blue-600 underline text-sm block mt-2"
                  >
                    View Resource →
                  </a>
                )}

                <p className="text-sm text-green-700 mt-3 italic">
                  {res.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
