import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  DollarSign,
  Trash2,
  BookOpen,
  Clock,
  Package,
  Zap,
  BarChart3,
  User,
} from "lucide-react"; // Importing relevant icons

// Helper component for the main metric cards
function MetricCard({ title, value, color, icon: Icon, unit = "" }) {
  return (
    <div className="p-6 bg-white shadow-2xl rounded-2xl border border-gray-100 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h2>
        <div
          className={`p-2 rounded-full ${
            color === "text-red-600"
              ? "bg-red-100"
              : color === "text-green-600"
              ? "bg-green-100"
              : "bg-blue-100"
          }`}
        >
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className={`text-4xl font-extrabold ${color}`}>
        {unit} {value}
      </p>
    </div>
  );
}

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
    userName: user?.name || "User", // Added for personalized greeting
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    if (!userId) {
      console.error("User ID not found.");
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/dashboard/${userId}`);
      setStats({
        ...res.data,
        userName: res.data.name || user?.name || "User",
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-12 mt-6 bg-white shadow-xl rounded-2xl text-center">
        <BarChart3 className="w-8 h-8 mx-auto text-green-500 animate-spin mb-4" />
        <p className="text-lg text-gray-600">
          Loading personalized insights...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      {/* --- Main Header --- */}
      <div className="mb-10 p-6 bg-white rounded-xl shadow-md border-l-4 border-green-500">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
          Welcome Back, {stats.userName.split(" ")[0]}!
        </h1>
        <p className="text-lg text-gray-500 mt-1">
          Your quick overview of consumption, inventory, and cost savings.
        </p>
      </div>

      {/* --- Section: Key Financial & Resource Stats --- */}
      <div className="grid lg:grid-cols-4 gap-6 mb-12">
        <MetricCard
          title="Monthly Food Budget"
          value={stats.monthlyBudget || 0}
          unit="৳"
          color="text-green-600"
          icon={DollarSign}
        />
        <MetricCard
          title="Total Potential Waste Cost"
          value={stats.totalWasteCost || 0}
          unit="৳"
          color="text-red-600"
          icon={Trash2}
        />
        <MetricCard
          title="Sustainability Resources"
          value={stats.resourcesCount || 0}
          color="text-blue-600"
          icon={BookOpen}
        />
        <MetricCard
          title="Profile Settings"
          value="Manage"
          color="text-gray-600"
          icon={User}
        />
      </div>

      {/* --- Section: Daily Activity & Inventory Alerts --- */}
      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        {/* Consumption Log Summary (Left Column) */}
        <div className="p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-600" />
            Today's Consumption Log
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <p className="text-gray-700 font-medium">Items Consumed</p>
              <span className="text-2xl font-bold text-blue-800">
                {stats.consumptionToday || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <p className="text-gray-700 font-medium">Consumption Cost</p>
              <span className="text-2xl font-bold text-blue-800">
                ৳ {stats.consumptionCostToday || 0}
              </span>
            </div>
          </div>

          <a
            href="/consumption"
            className="mt-6 inline-flex items-center justify-center w-full py-3 bg-blue-600 text-white rounded-xl shadow-lg font-semibold hover:bg-blue-700 transition transform hover:scale-[1.005]"
          >
            Log or View Consumption
            <Clock className="w-5 h-5 ml-2" />
          </a>
        </div>

        {/* Inventory Summary (Right Column) */}
        <div className="p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
            <Package className="w-6 h-6 mr-2 text-green-600" />
            Inventory & Expiration Alerts
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <p className="text-gray-700 font-medium">Total Inventory Items</p>
              <span className="text-2xl font-bold text-green-800">
                {stats.inventoryCount || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700 font-bold">Items Expiring Soon</p>
              <span className="text-2xl font-bold text-red-800">
                {stats.expiringSoonCount || 0}
              </span>
            </div>
          </div>

          <a
            href="/inventory"
            className="mt-6 inline-flex items-center justify-center w-full py-3 bg-green-600 text-white rounded-xl shadow-lg font-semibold hover:bg-green-700 transition transform hover:scale-[1.005]"
          >
            Manage Inventory Stock
            <Package className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>

      {/* --- Section: Quick Actions --- */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
          <Zap className="w-6 h-6 mr-2 text-yellow-500 inline-block" />
          Quick Access & Insights
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            href="/inventory"
            className="p-6 bg-yellow-500 text-white rounded-xl text-center shadow-lg font-semibold text-lg hover:bg-yellow-600 transition transform hover:scale-[1.02] flex items-center justify-center"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Check Expiring Items
          </a>

          <a
            href="/resources"
            className="p-6 bg-teal-500 text-white rounded-xl text-center shadow-lg font-semibold text-lg hover:bg-teal-600 transition transform hover:scale-[1.02] flex items-center justify-center"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Browse Sustainability Tips
          </a>
          <a
            href="/profile"
            className="p-6 bg-gray-700 text-white rounded-xl text-center shadow-lg font-semibold text-lg hover:bg-gray-800 transition transform hover:scale-[1.02] flex items-center justify-center"
          >
            <User className="w-5 h-5 mr-2" />
            Update Profile & Budget
          </a>
        </div>
      </div>
    </div>
  );
}
