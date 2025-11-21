import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { PlusCircle, Tag, Package, Calendar, Trash2, Box } from "lucide-react"; // Importing icons

// Helper function to check if an item is expiring soon (e.g., within 7 days)
const isExpiringSoon = (expiryDate) => {
  if (!expiryDate) return false;
  const today = new Date();
  const expiresAt = new Date(expiryDate);
  const diffTime = expiresAt - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
};

// Helper function to check if an item is expired
const isExpired = (expiryDate) => {
  if (!expiryDate) return false;
  const today = new Date();
  // Set today's time to midnight for an accurate day comparison
  today.setHours(0, 0, 0, 0);
  const expiresAt = new Date(expiryDate);
  // Set expiry time to midnight for an accurate day comparison
  expiresAt.setHours(0, 0, 0, 0);
  return expiresAt < today;
};

export default function InventoryPage() {
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    userId,
    name: "",
    category: "",
    quantity: "",
    expiresAt: "",
  });

  const loadInventory = () => {
    api
      .get(`/inventory/${userId}`)
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error loading inventory:", err));
  };

  useEffect(() => {
    loadInventory();
  }, [userId]);

  const handleAdd = async () => {
    if (!form.name || !form.quantity || !form.category) {
      alert("Please fill in item name, category, and quantity.");
      return;
    }
    try {
      await api.post("/inventory", form);
      // Clear form after successful submission
      setForm({ userId, name: "", category: "", quantity: "", expiresAt: "" });
      loadInventory();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await api.delete(`/inventory/${itemId}`);
      loadInventory();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <Box className="w-8 h-8 mr-3 text-blue-600" />
          Stock & Inventory Management
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Keep track of all your items, their quantities, and expiration dates.
        </p>
      </header>

      {/* --- Add Item Form --- */}
      <div className="bg-white p-6 md:p-8 shadow-xl rounded-2xl mb-10 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
          <PlusCircle className="w-5 h-5 mr-2 text-blue-600" />
          Add New Stock Item
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Item Name */}
          <div className="sm:col-span-2 relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-500"
              placeholder="Item name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Category */}
          <div className="sm:col-span-2 relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-500"
              placeholder="Category (e.g., Dairy, Produce)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>

          {/* Quantity */}
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            min="1"
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />

          {/* Expiration Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-500"
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="sm:col-span-2 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition duration-150 transform hover:scale-[1.01] flex items-center justify-center disabled:opacity-50"
            disabled={!form.name || !form.quantity || !form.category}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Item to Inventory
          </button>
        </div>
      </div>

      {/* --- Inventory List --- */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Current Stock ({items.length})
        </h2>

        {items.length === 0 ? (
          <div className="text-center p-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 italic">
              Your inventory is empty. Add a new item above!
            </p>
          </div>
        ) : (
          <div className="shadow-xl rounded-2xl overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((i) => {
                  const expired = isExpired(i.expiresAt);
                  const expiringSoon = isExpiringSoon(i.expiresAt) && !expired;

                  let expirationClass = "";
                  if (expired) {
                    expirationClass = "bg-red-100 text-red-800 font-medium";
                  } else if (expiringSoon) {
                    expirationClass =
                      "bg-yellow-100 text-yellow-800 font-medium";
                  }

                  return (
                    <tr
                      key={i._id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2 text-blue-500" />
                          {i.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        <span className="inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                          {i.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {i.quantity}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${expirationClass}`}
                      >
                        {i.expiresAt
                          ? new Date(i.expiresAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                        {expired && (
                          <span className="ml-2 text-xs p-1 rounded bg-red-600 text-white">
                            EXPIRED
                          </span>
                        )}
                        {expiringSoon && (
                          <span className="ml-2 text-xs p-1 rounded bg-yellow-500 text-gray-900">
                            Soon
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition duration-150"
                          onClick={() => handleDelete(i._id)}
                          title="Delete Item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
