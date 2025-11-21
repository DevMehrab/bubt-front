import { useEffect, useState } from "react";
import api from "../api/axios.js";
import InventoryPage from "./InventoryPage.jsx";
import { User, DollarSign, Leaf, Save, Edit2 } from "lucide-react"; // Importing icons

export default function ProfilePage() {
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const [profile, setProfile] = useState({
    name: "",
    budget: "",
    dietaryNeeds: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' or 'error'

  useEffect(() => {
    api
      .get(`/users/${userId}`)
      .then((res) => {
        // Ensure state is set, defaulting to empty strings if data is null/undefined
        setProfile({
          name: res.data.name || "",
          budget: res.data.budget || "",
          dietaryNeeds: res.data.dietaryNeeds || "",
        });
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, [userId]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await api.put(`/users/${userId}`, profile);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000); // Clear status after 3 seconds
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* --- Profile Management Card --- */}
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-3xl border border-gray-100">
          {/* Header */}
          <div className="flex items-center space-x-6 mb-10 border-b pb-4 border-green-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">
                Account Settings
              </h1>
              <p className="text-gray-500 mt-1">
                Customize your preferences and financial goals.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-bold mb-2 flex items-center"
              >
                <User className="w-4 h-4 mr-2 text-green-500" /> Name
              </label>
              <input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition-all outline-none shadow-sm"
                placeholder="Your Full Name"
              />
            </div>

            {/* Monthly Budget */}
            <div>
              <label
                htmlFor="budget"
                className="block text-gray-700 font-bold mb-2 flex items-center"
              >
                <DollarSign className="w-4 h-4 mr-2 text-green-500" /> Monthly
                Budget ($)
              </label>
              <input
                id="budget"
                name="budget"
                value={profile.budget}
                onChange={handleInputChange}
                type="number"
                min="0"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition-all outline-none shadow-sm"
                placeholder="e.g., 300 (How much you spend on food/groceries)"
              />
            </div>

            {/* Dietary Needs */}
            <div>
              <label
                htmlFor="dietaryNeeds"
                className="block text-gray-700 font-bold mb-2 flex items-center"
              >
                <Leaf className="w-4 h-4 mr-2 text-green-500" /> Dietary
                Preferences/Needs
              </label>
              <textarea
                id="dietaryNeeds"
                name="dietaryNeeds"
                value={profile.dietaryNeeds}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-xl h-32 focus:ring-green-500 focus:border-green-500 transition-all outline-none shadow-sm resize-none"
                placeholder="Write your dietary preferences or restrictions (e.g., Vegan, Gluten-free, Allergies)"
              ></textarea>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-4 rounded-xl text-lg font-bold transition-all shadow-lg flex items-center justify-center ${
                isSaving
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 hover:shadow-xl"
              }`}
            >
              {isSaving ? (
                <>
                  <Edit2 className="w-5 h-5 mr-3 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-3" /> Save Changes
                </>
              )}
            </button>

            {/* Status Alert */}
            {saveStatus === "success" && (
              <div className="p-3 bg-green-100 text-green-800 rounded-lg text-center font-medium border border-green-300">
                ✅ Profile updated successfully!
              </div>
            )}
            {saveStatus === "error" && (
              <div className="p-3 bg-red-100 text-red-800 rounded-lg text-center font-medium border border-red-300">
                ❌ Error saving profile. Please try again.
              </div>
            )}
          </div>
        </div>

        {/* --- Inventory Section --- */}
        <div className="mt-12">
          <InventoryPage />
        </div>
      </div>
    </div>
  );
}
