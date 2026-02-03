import api from "./axios";
import toast from "react-hot-toast";

// Login
export const loginRequest = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Register
export const registerRequest = async (name, email, password) => {
  try {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Forgot Password
export const forgotPasswordRequest = async (email) => {
  try {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  } catch (error) {
    handleApiError(error);
    // console.log(error);
    throw error;
  }
};

// Reset Password
export const resetPasswordRequest = async (token, newPassword) => {
  try {
    const res = await api.post(`/auth/reset-password/${token}`, {
      password: newPassword,
    });
    return res.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Refresh Token
export const refreshTokenRequest = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const res = await api.post("/auth/refresh", { refreshToken });

    // axios responses include data on `res.data`
    const data = res.data;

    if (!data || !data.accessToken) {
      throw new Error(data?.message || "Failed to refresh token");
    }

    return data.accessToken;
  } catch (error) {
    toast.error("Session expired. Please login again.");
    throw error;
  }
};

// 🔥 Common error handler
const handleApiError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong";
    // console.log(message);
  toast.error(message);
};
