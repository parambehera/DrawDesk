import { useState, useEffect } from "react";
import { forgotPasswordRequest } from "../api/auth";
import AuthCard from "../components/AuthCard";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPasswordRequest(email);
    setEmail("");
    toast.success(" A reset link has been sent.");
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#f5f9ff] via-[#eef4ff] to-[#f7fbff] flex items-center justify-center px-6 py-10">
      {/* Glass Wrapper */}
      <div className="w-full max-w-md relative">
        <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/70 shadow-[0_30px_80px_rgba(0,0,0,0.10)] p-6 md:p-8">
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-900">
            Forgot Password 
          </h1>
          <p className="text-gray-600 mt-2">
            Enter your email and we’ll send you a reset link.
          </p>

          {/* Form */}
          <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white shadow-md transition bg-linear-to-r cursor-pointer from-blue-600 to-indigo-600 hover:opacity-95"
            >
              Send Reset Link
            </button>
          </form>
        </div>

        {/* Glow Blob */}
        <div className="absolute -z-10 h-64 w-64 rounded-full bg-linear-to-br from-blue-200 via-indigo-200 to-purple-200 blur-3xl opacity-60 -bottom-10 -right-10" />
      </div>
    </div>
  );
}
