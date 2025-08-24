import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser, registerUser } from "../api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Flame } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGoogleLogin = () => {
    // In a real app, this would get the URL from the backend
    // window.location.href = 'http://localhost:5000/api/v0/auth/google';
    alert(
      "Google Sign-In is a future feature. Please use email/password for now."
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = isLoginView
        ? await loginUser({
            email: formData.email,
            password: formData.password,
          })
        : await registerUser(formData);

      setUser(data); // Update global auth state

      // The App.jsx routing logic will now handle the redirect automatically.
      // We can just navigate to the root.
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4 overflow-hidden relative">
      {/* Polymorph Blob Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Gradient Blobs */}
        <div
          className="blob-animated blob-gradient delay-1 top-0 left-0"
          style={{
            background: "radial-gradient(circle at 30% 30%, #00b8ff, #050443)",
          }}
        ></div>

        <div
          className="blob-animated blob-gradient delay-2 top-1/2 left-1/3"
          style={{
            background: "radial-gradient(circle at 40% 60%, #00ffff, #00b8ff)",
          }}
        ></div>

        <div
          className="blob-animated blob-gradient delay-3 top-1/3 right-0"
          style={{
            background: "radial-gradient(circle at 60% 40%, #ff8ae2, #00b8ff)",
          }}
        ></div>

        {/* Solid Color Blobs */}
        <div className="blob-animated blob-solid delay-4 bottom-1/4 left-1/5 bg-[#ffb347]"></div>
        <div className="blob-animated blob-solid delay-5 top-1/5 right-1/3 bg-[#98f5e1]"></div>
        <div className="blob-animated blob-solid delay-2 top-2/3 right-1/4 bg-[#a0f]"></div>
        <div className="blob-animated blob-solid delay-3 bottom-0 right-1/3 bg-[#00ffaa]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md glass-card rounded-2xl shadow-2xl p-8 space-y-6 z-10"
      >
        <div className="text-center space-y-2">
          <Flame className="mx-auto h-12 w-12 text-secondary" />
          <h2 className="text-3xl font-bold text-primary">
            {isLoginView ? "Welcome Back" : "Join FitTrack"}
          </h2>
        </div>

        {error && (
          <p className="text-danger text-center bg-danger/10 p-3 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <Input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
            />
          )}
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {!isLoginView && (
            <Input
              name="passwordConfirm"
              type="password"
              placeholder="Confirm Password"
              value={formData.passwordConfirm}
              onChange={handleChange}
            />
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Processing..."
              : isLoginView
              ? "Login"
              : "Create Account"}
          </Button>
        </form>
        {/* ... Google button and toggle view ... */}
      </motion.div>
    </div>
  );
};

export default Login;
