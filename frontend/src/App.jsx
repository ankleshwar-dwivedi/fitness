import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Performance from './pages/Performance'; // Renamed Planner to Performance
import Profile from './pages/Profile';
import Logger from './pages/Logger';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import Landing from './pages/Landing';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import GuestRoute from './components/layout/GuestRoute';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        {/* **THE FIX IS HERE:** This initial route handles the redirect after login */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to={user?.isAdmin ? "/admin" : "/dashboard"} replace /> : <Navigate to="/login" replace />
        }/>

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logger" element={<Logger />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Route>
      </Route>
      
      {/* Fallback for any other route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;