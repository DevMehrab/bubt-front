import { useEffect, useState } from "react";
import api from "../api/axios.js";
import InventoryPage from "./InventoryPage.jsx";

export default function ProfilePage() {
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const [profile, setProfile] = useState({
    name: "",
    budget: "",
    dietaryNeeds: "",
  });

  useEffect(() => {
    api.get(`/users/${userId}`).then((res) => setProfile(res.data));
  }, [userId]);

  const handleSave = async () => {
    await api.put(`/users/${userId}`, profile);
    alert("Profile updated!");
  };

  return (
    <>
      <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-2xl">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full shadow-inner"></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
            <p className="text-gray-500 text-sm">
              Manage your personal information
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Monthly Budget
            </label>
            <input
              onChange={(e) =>
                setProfile({ ...profile, budget: e.target.value })
              }
              type="number"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your budget"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Dietary Needs
            </label>
            <textarea
              onChange={(e) =>
                setProfile({ ...profile, dietaryNeeds: e.target.value })
              }
              className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Write your dietary preferences or restrictions"
            ></textarea>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>

      <InventoryPage />
    </>
  );
}
