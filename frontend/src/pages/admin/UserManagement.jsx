import { useEffect, useState } from "react";
import {
  adminGetAllUsers,
  adminDeleteUser,
  adminChangeUserPassword,
} from "../../api";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import { Trash2, UserCheck, Shield, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [feedback, setFeedback] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminGetAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setNewPassword("");
    setFeedback("");
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminChangeUserPassword(selectedUser._id, { newPassword });
      setFeedback("Password changed successfully!");
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1500);
    } catch (error) {
      setFeedback(
        error.response?.data?.message || "Failed to change password."
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId, userName) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${userName}? This action is irreversible.`
      )
    ) {
      try {
        await adminDeleteUser(userId);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
      } catch (error) {
        alert(
          `Failed to delete user: ${
            error.response?.data?.message || "Server error"
          }`
        );
      }
    }
  };

  // Placeholder for a future feature
  const handleChangePassword = (userName) => {
    alert(
      `In a real app, this would open a modal to change the password for ${userName}.`
    );
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8">User Management</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-primary/20">
              <tr>
                <th className="p-4 font-bold">Name</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Joined</th>
                <th className="p-4 font-bold text-center">Role</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr
                  key={user._id}
                  className="border-b border-light hover:bg-light/80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-muted">{user.email}</td>
                  <td className="p-4 text-muted">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    {user.isAdmin ? (
                      <Shield title="Admin" className="mx-auto text-success" />
                    ) : (
                      <UserCheck title="User" className="mx-auto text-muted" />
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        className="bg-primary/80 hover:bg-primary text-white !px-3 !py-1.5"
                        onClick={() => openPasswordModal(user)}
                        title="Change Password"
                      >
                        <KeyRound size={16} />
                      </Button>
                      <Button
                        className="bg-danger/80 hover:bg-danger text-white !px-3 !py-1.5"
                        onClick={() => handleDelete(user._id, user.name)}
                        disabled={user.isAdmin}
                        title={
                          user.isAdmin
                            ? "Cannot delete an admin"
                            : "Delete user"
                        }
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Change Password for ${selectedUser?.name}`}>
                <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                    <p className="text-muted">Enter a new password for the user. They will be able to log in with this new password immediately.</p>
                    <Input 
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button type="submit" className="w-full">Set New Password</Button>
                    {feedback && <p className="text-center text-success">{feedback}</p>}
                </form>
      </Modal>

    </div>
  );
};

export default UserManagement;
