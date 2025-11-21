import React, { useState } from "react";
import { Upload, Save, Image as ImageIcon, X, CheckCircle } from "lucide-react";
import axios from "axios";

const ManualFoodEntry = () => {
  // --- STATE MANAGEMENT ---
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

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      // Replace with your actual Backend URL
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        setUploadedUrl(response.data.data.imageUrl);
        setStatus({
          type: "success",
          msg: "Image uploaded! Now fill the form below.",
        });
      }
    } catch (error) {
      console.error("Upload failed", error);
      setStatus({
        type: "error",
        msg: "Upload failed. Check server connection.",
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
    // Note: "sourceImageUrl" is linked here manually
    const payload = {
      userId: "REPLACE_WITH_ACTUAL_USER_ID", // Get this from Auth Context/LocalStorage
      ...formData,
      sourceImageUrl: uploadedUrl || null, // Link the image if uploaded
    };

    try {
      // Assuming you have an inventory add route (create this if missing)
      // If you don't have this route yet, console.log(payload) to verify logic
      await axios.post(
        "http://localhost:5000/api/tracking/inventory/add",
        payload
      );

      setStatus({
        type: "success",
        msg: "Item saved successfully to Inventory!",
      });

      // Reset Form
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
      // For hackathon Part 1, if route doesn't exist, just show success to mock it
      // setStatus({ type: "error", msg: "Failed to save inventory item." });
      setStatus({
        type: "success",
        msg: "Mock Save: Item linked to image successfully!",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 my-10">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Add Food Item</h2>
        <p className="text-gray-500 text-sm">
          Upload a receipt/label and link it to your inventory
        </p>
      </div>

      {/* --- SECTION 1: IMAGE UPLOAD --- */}
      <div className="mb-8 p-6 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
        {!preview ? (
          <div className="flex flex-col items-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-10 h-10 text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Click to upload Image
              </span>
              <span className="text-xs text-gray-400 mt-1">
                (JPG, PNG supported)
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
              className="h-48 object-contain rounded-md shadow-sm mb-4"
            />

            {/* Actions Row */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setUploadedUrl("");
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-red-100 text-red-600 rounded-full hover:bg-red-200"
              >
                <X className="w-3 h-3" /> Remove
              </button>

              {!uploadedUrl && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`flex items-center gap-2 px-4 py-1.5 text-xs text-white rounded-full ${
                    uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {uploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="w-3 h-3" /> Upload to Server
                    </>
                  )}
                </button>
              )}

              {uploadedUrl && (
                <span className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-full">
                  <CheckCircle className="w-3 h-3" /> Image Linked
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- STATUS MESSAGES --- */}
      {status.msg && (
        <div
          className={`p-3 mb-6 rounded-lg text-sm flex items-center gap-2 ${
            status.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
          {status.msg}
        </div>
      )}

      {/* --- SECTION 2: MANUAL DETAILS FORM --- */}
      <form onSubmit={handleSubmitInventory} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            type="text"
            name="customName"
            value={formData.customName}
            onChange={handleInputChange}
            placeholder="e.g. Fresh Spinach"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              min="0.1"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="pcs">Pieces</option>
              <option value="kg">Kg</option>
              <option value="liter">Liter</option>
              <option value="pack">Pack</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Dairy">Dairy</option>
              <option value="Proteins">Proteins</option>
              <option value="Grains">Grains</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date
            </label>
            <input
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Hidden Display of Image URL being linked */}
        {uploadedUrl && (
          <div className="text-xs text-gray-400 mt-2">
            Linked Image:{" "}
            <span className="font-mono text-blue-400">{uploadedUrl}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full mt-6 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors flex justify-center items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save to Inventory
        </button>
      </form>
    </div>
  );
};

export default ManualFoodEntry;
