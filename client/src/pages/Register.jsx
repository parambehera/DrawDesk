import { useState, useEffect } from "react";
import { registerRequest } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // simple validation
    if (!form.name || !form.email || !form.password)
      return toast.error("All fields are required");

    try {
      setLoading(true);

      const data = await registerRequest(form.name, form.email, form.password);

      toast.success("Account created! Please login.");

      // navigate to login page
      navigate("/login");
    } catch (error) {
      // error is handled by API handler
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#f5f9ff] via-[#eef4ff] to-[#f7fbff] flex items-center justify-center px-6 py-10">
      {/* Glass Auth Card */}
      <div className="w-full max-w-md relative">
        <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/70 shadow-[0_30px_80px_rgba(0,0,0,0.10)] p-6 md:p-8">
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create Account 
          </h1>
          <p className="text-gray-600 mt-2">
            Join <span className="font-semibold"> DrawDesk</span> and start
            collaborating
          </p>

          {/* Form */}
          <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl cursor-pointer font-semibold text-white shadow-md transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95"
              }`}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

            {/* Switch Link */}
            <p className="text-sm text-gray-600 text-center mt-2">
              Already have an account?{" "}
              <Link className="text-blue-700 font-semibold hover:underline" to="/login">
                Login
              </Link>
            </p>
          </form>
        </div>

        {/* Glow Blob */}
        <div className="absolute -z-10 h-64 w-64 rounded-full bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 blur-3xl opacity-60 -top-10 -left-10" />
      </div>
    </div>
  );
}
