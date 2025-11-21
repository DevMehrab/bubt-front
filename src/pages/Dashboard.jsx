import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Leaf, Utensils, TrendingDown, BookOpen } from "lucide-react";
import api from "../api/axios.js";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState({
    inventoryCount: 0,
    totalValue: 0,
    moneyLost: 0,
    recentLogs: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        // --------------------------
        // 1. Inventory Stats
        // --------------------------
        const invRes = await api.get(`/inventory/${user.id}`);
        const inventory = invRes.data;

        let count = 0;
        let value = 0;

        inventory.forEach((item) => {
          count += Number(item.quantity || 0);
          value += Number(item.cost || 0) * Number(item.quantity || 0);
        });

        // --------------------------
        // 2. Waste Stats
        // --------------------------
        const wasteRes = await api.get(`/waste/${user.id}`);
        const waste = wasteRes.data;

        let lost = 0;
        waste.forEach((item) => {
          lost += Number(item.cost || 0);
        });

        // --------------------------
        // 3. Recent Consumption Logs
        // --------------------------

        const logRes = await api.get(`/consumption/${user.id}`);
        const logs = logRes.data;
        console;
        logs.sort(
          (a, b) =>
            new Date(b.consumedAt).getTime() - new Date(a.consumedAt).getTime()
        );

        setStats({
          inventoryCount: count,
          totalValue: value,
          moneyLost: lost,
          recentLogs: logs.slice(0, 5),
        });

        setLoading(false);
      } catch (err) {
        console.error("Dashboard Error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-slate-800">
          Hello, {user?.name || "Eco Warrior"}! 👋
        </h1>
        <p className="text-slate-500">Here is your impact summary.</p>
      </header>

      {/* ================== STATS CARDS ================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Inventory Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 uppercase font-bold">
                Current Inventory
              </p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                ৳{stats.totalValue.toFixed(0)}
              </h3>
              <p className="text-xs text-green-600 mt-1">
                {stats.inventoryCount} Items stored
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Package />
            </div>
          </div>
        </div>

        {/* Money Lost */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm text-red-500 uppercase font-bold">
                Money Lost (Waste)
              </p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                ৳{stats.moneyLost.toFixed(0)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Value of thrown away food
              </p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <TrendingDown />
            </div>
          </div>
        </div>

        {/* Eco Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 uppercase font-bold">
                Eco Status
              </p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">Active</h3>
              <p className="text-xs text-slate-400 mt-1">
                Keep tracking to reduce waste!
              </p>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Leaf />
            </div>
          </div>
        </div>
      </div>

      {/* ================== RECENT CONSUMPTION + TIP ================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Consumption */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-4">Recent Consumption</h3>

          {loading ? (
            <p>Loading...</p>
          ) : stats.recentLogs.length === 0 ? (
            <p className="text-slate-400 text-sm">No meals logged yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentLogs.map((log) => (
                <div
                  key={log._id}
                  className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                      <Utensils size={14} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{log.itemName}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(log.consumedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-bold bg-slate-100 px-2 py-1 rounded">
                    -1
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tip of the Day */}
        <div className="bg-gradient-to-br from-green-600 to-teal-700 p-6 rounded-xl text-white">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={20} />
            <h3 className="font-bold text-lg">Tip of the Day</h3>
          </div>

          <p className="text-green-50 text-lg font-medium mb-4">
            "Store dairy products on the middle shelf of your fridge, not the
            door, to keep temperature consistent."
          </p>

          <Link
            to="/resources"
            className="inline-block bg-white text-green-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-50 transition"
          >
            View All Resources
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
