import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

import Navbar from "./components/Layout/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import UserDashboard from "./pages/UserDashboard";
import NearbyPage from "./pages/NearbyPage";

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to={user ? (user.role === "pharmacy" ? "/dashboard/pharmacy" : "/dashboard/user") : "/search"} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/nearby" element={<NearbyPage />} />
        <Route path="/dashboard/pharmacy" element={
          <PrivateRoute role="pharmacy"><PharmacyDashboard /></PrivateRoute>
        } />
        <Route path="/dashboard/user" element={
          <PrivateRoute role="user"><UserDashboard /></PrivateRoute>
        } />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <AppRoutes />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
