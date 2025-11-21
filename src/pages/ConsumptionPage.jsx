import { useEffect, useState } from "react";
import api from "../api/axios.js";
import TrackingSummary from "../components/TrackingSummury.jsx";
import { PlusCircle, Trash2, Tag, Calendar, Package } from "lucide-react"; // Importing icons for better visual cues

export default function ConsumptionPage() {
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    userId,
    itemName: "",
    category: "",
  });

  // Function to load consumption logs
  const loadLogs = () => {
    // Added a console.log for better debugging, remove in production
    // console.log("Loading logs for user:", userId);
    api
      .get(`/consumption/${userId}`)
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Error loading logs:", err));
  };

  // Function to handle log deletion (added for completeness)
  const handleDelete = async (logId) => {
    try {
      await api.delete(`/consumption/${logId}`);
      loadLogs(); // Reload logs after successful deletion
    } catch (error) {
      console.error("Error deleting log:", error);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [userId]);

  // Function to handle logging a new item
  const handleLog = async () => {
    if (!form.itemName || !form.category) {
      alert("Please enter both item name and category.");
      return;
    }
    try {
      await api.post("/consumption", form);
      // Clear the form fields after successful submission
      setForm({ ...form, itemName: "", category: "" });
      loadLogs(); // Fetch the updated list of logs
    } catch (error) {
      console.error("Error logging consumption:", error);
      alert("Failed to log consumption.");
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Daily Consumption Log 🍎
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Track and manage your daily item consumption.
          </p>
        </header>

        {/* --- Log Consumption Form Section --- */}
        <div className="bg-white p-6 md:p-8 shadow-2xl rounded-2xl mb-10 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <PlusCircle className="w-5 h-5 mr-2 text-green-600" />
            Add New Log
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Item Name Input */}
            <div className="md:col-span-1 relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out placeholder-gray-500"
                placeholder="Item name (e.g., Apple, Coffee)"
                value={form.itemName}
                onChange={(e) => setForm({ ...form, itemName: e.target.value })}
              />
            </div>

            {/* Category Input */}
            <div className="md:col-span-1 relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out placeholder-gray-500"
                placeholder="Category (e.g., Fruit, Beverage)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            {/* Log Button */}
            <div className="md:col-span-1">
              <button
                onClick={handleLog}
                className="w-full py-3 bg-green-600 text-white font-medium rounded-lg shadow-lg hover:bg-green-700 transition duration-150 ease-in-out transform hover:scale-[1.01] flex items-center justify-center disabled:opacity-50"
                disabled={!form.itemName || !form.category}
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Log Consumption
              </button>
            </div>
          </div>
        </div>

        {/* --- Tracking Summary Section --- */}
        <TrackingSummary />

        {/* --- Consumption Logs List Section --- */}
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Recent Logs ({logs.length})
          </h2>

          {logs.length === 0 ? (
            <div className="text-center p-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 italic">
                No consumption logs recorded yet. Start tracking above!
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {logs.map((l) => (
                <li
                  key={l._id}
                  className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 flex justify-between items-center border-l-4 border-green-500"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900 capitalize">
                        {l.itemName}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-0.5">
                        <Tag className="w-4 h-4 mr-1.5" />
                        <span className="capitalize">{l.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-gray-600 text-xs flex items-center justify-end">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {new Date(l.consumedAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(l.consumedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(l._id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition duration-150"
                      title="Delete Log"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
