import { useEffect, useState } from 'react';
import { adminGetAllUsers, adminDeleteUser } from '../api';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { Trash2, UserCheck, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await adminGetAllUsers();
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action is irreversible.')) {
            try {
                await adminDeleteUser(userId);
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            } catch (error) {
                alert('Failed to delete user.');
            }
        }
    };

    if (loading) return <Spinner size="lg" />;

    return (
        <div>
            <h1 className="text-4xl font-bold text-primary mb-6">Admin - User Management</h1>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-primary/20">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4 text-center">Role</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <motion.tr 
                                  key={user._id} 
                                  className="border-b border-light hover:bg-light"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4 text-muted">{user.email}</td>
                                    <td className="p-4 text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-center">
                                        {user.isAdmin ? <Shield className="mx-auto text-success" /> : <UserCheck className="mx-auto text-muted" />}
                                    </td>
                                    <td className="p-4 text-center">
                                        <Button 
                                          variant="danger" 
                                          className="bg-danger/80 hover:bg-danger text-white !px-3 !py-1.5"
                                          onClick={() => handleDelete(user._id)}
                                          disabled={user.isAdmin} // Prevent deleting other admins
                                          title={user.isAdmin ? "Cannot delete an admin" : "Delete user"}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Admin;