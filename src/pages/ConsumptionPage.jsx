import { useEffect, useState } from "react";
import api from "../api/axios.js";
import TrackingSummary from "../components/TrackingSummury.jsx";

export default function ConsumptionPage() {
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    userId,
    itemName: "",
    category: "",
  });

  const loadLogs = () => {
    api.get(`/consumption/${userId}`).then((res) => setLogs(res.data));
  };

  useEffect(() => {
    loadLogs();
  }, [userId]);

  const handleLog = async () => {
    await api.post("/consumption", form);
    loadLogs();
  };

  return (
    <>
      <div className="max-w-3xl mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Daily Consumption Log</h1>

        <div className="bg-white p-4 shadow rounded-xl mb-6 space-y-3">
          <input
            className="w-full p-2 border rounded"
            placeholder="Item name"
            onChange={(e) => setForm({ ...form, itemName: e.target.value })}
          />

          <input
            className="w-full p-2 border rounded"
            placeholder="Category"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <button
            onClick={handleLog}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Log Consumption
          </button>
        </div>

        <ul className="space-y-2">
          {/* {logs.map((l) => (
            <li
              key={l._id}
              className="p-3 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{l.itemName}</p>
                <p className="text-gray-600 text-sm">{l.category}</p>
              </div>

              <span className="text-gray-500 text-sm">
                {new Date(l.consumedAt).toLocaleDateString()}
              </span>
            </li>
          ))} */}
        </ul>
      </div>
      <TrackingSummary />
    </>
  );
}
