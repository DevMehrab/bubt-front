import React, { useState } from "react";
import {
  Upload,
  Save,
  X,
  CheckCircle,
  Package,
  Calendar,
  Tag,
  Weight,
} from "lucide-react";
import axios from "axios";

// NOTE: Remember to set your actual backend URL here
const API_BASE_URL = "http://localhost:5000/api";

const ManualFoodEntry = () => {
  // --- STATE MANAGEMENT ---
  const userId = "USER_123_MOCK"; // Placeholder: Replace with actual Auth Context/LocalStorage value
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    customName: "",
    quantity: 1,
    unit: "pcs",
    expirationDate: "",
    category: "Other",
  });

  const [status, setStatus] = useState({ type: "", msg: "" });

  // --- HANDLERS ---

  // 1. Handle File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setUploadedUrl(""); // Reset if new file selected
      setStatus({ type: "", msg: "" });
    }
  };

  // 2. Upload Image to Backend
  const handleUpload = async () => {
    if (!file) {
      setStatus({ type: "error", msg: "Please select a file first." });
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      setUploading(true);
      const response = await axios.post(
        `${API_BASE_URL}/upload`,
        uploadFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        setUploadedUrl(response.data.data.imageUrl);
        setStatus({
          type: "success",
          msg: "Image uploaded! Now complete the form below.",
        });
      }
    } catch (error) {
      console.error("Upload failed", error);
      setStatus({
        type: "error",
        msg: "Upload failed. Check server connection or Cloudinary config.",
      });
    } finally {
      setUploading(false);
    }
  };

  // 3. Handle Form Input Changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Submit Inventory Item (Manual Association)
  const handleSubmitInventory = async (e) => {
    e.preventDefault();

    if (!formData.customName) {
      setStatus({ type: "error", msg: "Please enter an item name." });
      return;
    }

    // Prepare the final payload
    const payload = {
      userId,
      ...formData,
      sourceImageUrl: uploadedUrl || null, // Link the image if uploaded
    };

    try {
      await axios.post(`${API_BASE_URL}/tracking/inventory/add`, payload);

      setStatus({
        type: "success",
        msg: "Item saved successfully to Inventory!",
      });

      // Reset Form and Image
      setFile(null);
      setPreview(null);
      setUploadedUrl("");
      setFormData({
        customName: "",
        quantity: 1,
        unit: "pcs",
        expirationDate: "",
        category: "Other",
      });
    } catch (error) {
      console.error("Save failed", error);
      // Fallback message for development if backend route isn't fully implemented
      setStatus({
        type: "error",
        msg: "Failed to save inventory item. Check console for error.",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-green-100 my-12">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Manual Inventory Entry 📝
        </h2>
        <p className="text-gray-500 mt-1">
          Upload a receipt or item image and add details to your stock.
        </p>
      </div>

      {/* --- STATUS MESSAGES --- */}
      {status.msg && (
        <div
          className={`p-4 mb-6 rounded-xl text-md font-medium flex items-center gap-3 ${
            status.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
          {status.msg}
        </div>
      )}

      {/* --- SECTION 1: IMAGE UPLOAD --- */}
      <div className="mb-8 p-6 bg-blue-50 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors shadow-inner">
        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2" /> 1. Upload Image
        </h3>
        {!preview ? (
          <div className="flex flex-col items-center py-6">
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition"
            >
              <Upload className="w-12 h-12 text-blue-500 mb-2" />
              <span className="text-base font-medium text-gray-700">
                Click to select Image
              </span>
              <span className="text-xs text-gray-400 mt-1">
                (JPG, PNG, max 5MB)
              </span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="relative flex flex-col items-center">
            <img
              src={preview}
              alt="Preview"
              className="max-h-60 w-auto object-contain rounded-lg shadow-xl mb-4 border border-gray-200"
            />

            {/* Actions Row */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setUploadedUrl("");
                  setStatus({ type: "", msg: "" });
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition"
              >
                <X className="w-4 h-4" /> Remove
              </button>

              {!uploadedUrl && (
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading || !file}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-full transition ${
                    uploading
                      ? "bg-gray-400 cursor-wait"
                      : "bg-blue-600 hover:bg-blue-700 shadow-md"
                  }`}
                >
                  {uploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Upload & Link
                    </>
                  )}
                </button>
              )}

              {uploadedUrl && (
                <span className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-green-100 text-green-700 rounded-full border border-green-300">
                  <CheckCircle className="w-4 h-4" /> Image Uploaded & Linked
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- SECTION 2: MANUAL DETAILS FORM --- */}
      <form onSubmit={handleSubmitInventory} className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
          <Package className="w-5 h-5 mr-2 text-green-600" /> 2. Enter Item
          Details
        </h3>

        {/* Item Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Item Name
          </label>
          <input
            type="text"
            name="customName"
            value={formData.customName}
            onChange={handleInputChange}
            placeholder="e.g. Fresh Spinach, 1lb Pack"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Quantity */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center">
              <Weight className="w-4 h-4 mr-1 text-gray-500" /> Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
              min="0.1"
              step="0.1"
            />
          </div>
          {/* Unit */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center">
              <Tag className="w-4 h-4 mr-1 text-gray-500" /> Unit
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
            >
              <option value="pcs">Pieces (pcs)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="liter">Liter (L)</option>
              <option value="pack">Pack/Container</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center">
              <Tag className="w-4 h-4 mr-1 text-gray-500" /> Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
            >
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Dairy">Dairy</option>
              <option value="Proteins">Proteins (Meat, Fish, Tofu)</option>
              <option value="Grains">Grains & Bread</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* Expiration Date */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-500" /> Expiration
              Date
            </label>
            <input
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-8 bg-green-600 text-white py-3 rounded-xl font-extrabold text-lg hover:bg-green-700 transition-colors shadow-lg flex justify-center items-center gap-2 transform hover:scale-[1.005]"
          disabled={uploading}
        >
          <Save className="w-5 h-5" /> Save Item to Inventory
        </button>
      </form>
    </div>
  );
};

export default ManualFoodEntry;
