import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  Clock,
  BarChart3,
  Leaf,
  Upload,
  User,
  LayoutDashboard,
} from "lucide-react"; // Importing icons

// Define the navigation links with icons and paths
const navLinks = [
  { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
  { path: "/inventory", name: "Inventory", icon: Package },
  { path: "/consumption", name: "Logs", icon: Clock },
  { path: "/analytics", name: "Analytics", icon: BarChart3 },
  { path: "/resources", name: "Resources", icon: Leaf },
  { path: "/upload", name: "Upload", icon: Upload },
];

export default function MainLayout() {
  const location = useLocation(); // Hook to get the current URL path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- NAVBAR --- */}
      <nav className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-green-600 flex items-center hover:text-green-700 transition"
          >
            <Home className="w-6 h-6 mr-2" />
            <span className="tracking-tight">
              Food<span className="text-gray-900">Track</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-1 text-gray-700 font-medium items-center">
            {navLinks.map((link) => {
              // Determine if the current link is active
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center px-3 py-2 rounded-lg transition duration-200 
                    text-sm font-semibold
                    ${
                      isActive
                        ? "bg-green-50 text-green-700 shadow-sm" // Active state
                        : "hover:bg-gray-100 hover:text-gray-900" // Inactive state
                    }
                  `}
                >
                  <link.icon className="w-4 h-4 mr-1.5" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Profile Link (Always Visible) */}
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200 text-sm font-semibold transform hover:scale-[1.05]"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Link>
        </div>
      </nav>

      {/* --- PAGE CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  );
}
