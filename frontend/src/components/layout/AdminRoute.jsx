import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Card from '../ui/Card';

const AdminRoute = () => {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return (
      <Card className="text-center">
        <h2 className="text-2xl font-bold text-danger">Access Denied</h2>
        <p className="text-muted">You do not have permission to view this page.</p>
        <Navigate to="/" replace />
      </Card>
    )
  }
  return <Outlet />;
};

export default AdminRoute;