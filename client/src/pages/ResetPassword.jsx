import { useState, useEffect } from "react";
import { resetPasswordRequest } from "../api/auth";
import { useParams, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const { token } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPasswordRequest(token, password);
    toast.success("Password updated! Please login.");
    navigate("/login");
  };

  return (
    <main className="min-h-screen w-full bg-linear-to-b from-[#f5f9ff] via-[#eef4ff] to-[#f7fbff] flex items-center justify-center px-4">
      {/* Glass Card */}
      <div className="w-full max-w-md rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-[0_30px_80px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="p-8 md:p-10">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-gray-900">
              Reset Password 
            </h1>
            <p className="mt-2 text-gray-600 text-sm">
              Create a new password to secure your account.
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-bold text-gray-700">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-gray-900 outline-none shadow-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 shadow-md hover:shadow-lg hover:scale-[1.01] transition cursor-pointer"
            >
              Update Password
            </button>

            <p className="text-center text-sm text-gray-500 mt-2">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-blue-700 hover:text-indigo-700 transition underline underline-offset-4"
              >
                Back to Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
