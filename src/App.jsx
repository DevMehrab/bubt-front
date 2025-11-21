import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Resources from "./pages/Resources";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UploadPage from "./pages/UploadPage";
import ProfilePage from "./pages/ProfilePage";
import InventoryPage from "./pages/InventoryPage";
import ConsumptionPage from "./pages/ConsumptionPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AuthProvider from "../providers/AuthProvider";
import Dashboard from "./pages/DashboardMain";
import MainLayout from "../layouts/MainLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* PROTECTED LAYOUT ROUTES */}
          <Route element={<MainLayout />}>
            <Route path="/resources" element={<Resources />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/consumption" element={<ConsumptionPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
