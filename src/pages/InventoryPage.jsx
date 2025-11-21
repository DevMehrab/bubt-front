import { useEffect, useState } from "react";
import api from "../api/axios.js";

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

  console.log(userId);
  const loadInventory = () => {
    api.get(`/inventory/${userId}`).then((res) => setItems(res.data));
  };

  useEffect(() => {
    loadInventory();
  }, [userId]);

  const handleAdd = async () => {
    await api.post("/inventory", form);
    loadInventory();
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      <div className="bg-white p-4 shadow rounded-xl mb-6 grid grid-cols-2 gap-3">
        <input
          className="p-2 border rounded"
          placeholder="Item name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="p-2 border rounded"
          placeholder="Category"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          className="p-2 border rounded"
          type="number"
          placeholder="Quantity"
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <input
          className="p-2 border rounded"
          type="date"
          onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
        />

        <button
          onClick={handleAdd}
          className="col-span-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </div>

      <table className="w-full bg-white shadow rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Qty</th>
            <th className="p-3 text-left">Expires</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {items.map((i) => (
            <tr key={i._id} className="border-t">
              <td className="p-3">{i.name}</td>
              <td className="p-3">{i.category}</td>
              <td className="p-3">{i.quantity}</td>
              <td className="p-3">
                {i.expiresAt ? i.expiresAt.slice(0, 10) : "—"}
              </td>

              <td className="p-3">
                <button
                  className="text-red-600"
                  onClick={() => {
                    api.delete(`/inventory/${i._id}`).then(loadInventory);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
