import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">
            FoodTrack
          </Link>

          <div className="flex gap-6 text-gray-700 font-medium">
            <Link to="/dashboard" className="hover:text-black">
              Dashboard
            </Link>
            <Link to="/inventory" className="hover:text-black">
              Inventory
            </Link>
            <Link to="/consumption" className="hover:text-black">
              Logs
            </Link>
            <Link to="/analytics" className="hover:text-black">
              Analytics
            </Link>
            <Link to="/resources" className="hover:text-black">
              Resources
            </Link>
            <Link to="/upload" className="hover:text-black">
              Upload
            </Link>
            <Link to="/profile" className="hover:text-black">
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}
