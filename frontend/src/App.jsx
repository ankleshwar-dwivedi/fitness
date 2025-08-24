import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Planner from "./pages/Planner";
import Profile from "./pages/Profile";
import Logger from "./pages/Logger";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminRoute from "./components/layout/AdminRoute";
import GuestRoute from "./components/layout/GuestRoute";
import { useAuth } from "./hooks/useAuth";

const InitialRedirect = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-primary">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log({ loading, isAuthenticated, isAdmin });
    return <Navigate to="/landing" replace />;
  }

  return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
};

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logger" element={<Logger />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Route>
      </Route>

      {/* **THE FIX IS HERE:** This is now the entry point. */}
      <Route path="" element={<InitialRedirect />} />
      <Route path="/" element={<InitialRedirect />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
