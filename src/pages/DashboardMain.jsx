import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [stats, setStats] = useState({
    monthlyBudget: 0,
    totalWasteCost: 0,
    resourcesCount: 0,
    consumptionToday: 0,
    consumptionCostToday: 0,
    inventoryCount: 0,
    expiringSoonCount: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get(`/dashboard/${userId}`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Dashboard Overview
      </h1>

      {/* Top Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card
          title="Monthly Budget"
          value={`৳ ${stats.monthlyBudget}`}
          color="text-green-600"
        />
        <Card
          title="Total Waste Cost"
          value={`৳ ${stats.totalWasteCost}`}
          color="text-red-600"
        />
        <Card
          title="Resources Available"
          value={stats.resourcesCount}
          color="text-blue-600"
        />
      </div>

      {/* Consumption & Inventory */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        {/* Consumption Log Summary */}
        <div className="p-6 bg-white shadow-lg rounded-xl border hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Today's Consumption
          </h2>
          <p className="text-gray-600 mb-1">
            Items Consumed:{" "}
            <span className="font-semibold">{stats.consumptionToday}</span>
          </p>
          <p className="text-gray-600 mb-4">
            Total Cost:{" "}
            <span className="font-semibold text-blue-600">
              ৳ {stats.consumptionCostToday}
            </span>
          </p>

          <a
            href="/consumption"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            View Full Log
          </a>
        </div>

        {/* Inventory Summary */}
        <div className="p-6 bg-white shadow-lg rounded-xl border hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Inventory Summary
          </h2>

          <p className="text-gray-600 mb-1">
            Inventory Items:{" "}
            <span className="font-semibold">{stats.inventoryCount}</span>
          </p>

          <p className="text-gray-600 mb-4">
            Expiring Soon:{" "}
            <span className="font-semibold text-red-600">
              {stats.expiringSoonCount}
            </span>
          </p>

          <a
            href="/inventory"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
          >
            Manage Inventory
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="/inventory"
            className="p-5 bg-blue-600 text-white rounded-xl text-center shadow-md hover:bg-blue-700"
          >
            Check Inventry
          </a>

          <a
            href="/resources"
            className="p-5 bg-green-600 text-white rounded-xl text-center shadow-md hover:bg-green-700"
          >
            Browse Sustainability Tips
          </a>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl border hover:shadow-xl transition">
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className={`text-3xl font-bold mt-3 ${color}`}>{value}</p>
    </div>
  );
}
