import { useState, useEffect } from "react";
import { loginRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password)
      return toast.error("Email and password are required");
    try {
      setLoading(true);
      const data = await loginRequest(email, password);
      login(data.user, data.accessToken, data.refreshToken);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (error) {
      // handled by API error handler
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#f5f9ff] via-[#eef4ff] to-[#f7fbff] flex items-center justify-center px-6 py-10">
      {/* Outer Glass Wrapper */}
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/70 shadow-[0_30px_80px_rgba(0,0,0,0.10)] p-6 md:p-8">
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome Back 
          </h1>
          <p className="text-gray-600 mt-2">
            Login to continue using <span className="font-semibold"> DrawDesk</span>
          </p>

          {/* Form */}
          <form className="flex flex-col gap-4 mt-8" onSubmit={handleLogin}>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold cursor-pointer text-white shadow-md transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95"
              }`}
            >
              {loading ? "Loading..." : "Login"}
            </button>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-700 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <p className="text-sm text-gray-600 text-center mt-2">
              Don't have an account?{" "}
              <Link className="text-blue-700 font-semibold hover:underline" to="/register">
                Register
              </Link>
            </p>
          </form>

          {/* Glow blob */}
          <div className="absolute -z-10 h-60 w-60 rounded-full bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 blur-3xl opacity-60 -top-10 -right-12" />
        </div>
      </div>
    </div>
  );
}
