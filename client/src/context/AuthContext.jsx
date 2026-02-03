import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

let ACCESS_TOKEN = null; // stored only in memory

export const getAccessToken = () => ACCESS_TOKEN;
export const setAccessToken = (token) => (ACCESS_TOKEN = token);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        setLoading(false);
        return;
      }
      
      try {
        // First get access token via refresh
        const { refreshTokenRequest } = await import("../api/auth");
        const accessToken = await refreshTokenRequest();
        setAccessToken(accessToken);
        
        // Now fetch user details with valid access token
        const res = await api.get("/auth/me");
        // console.log("User data fetched:", res);
        const userData = res.data?.user || res.data;
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user details:", err);
        setUser(null);
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);
  const login = (userData, accessToken, refreshToken) => {
    setUser(userData);
    ACCESS_TOKEN = accessToken;
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logout = () => {
    ACCESS_TOKEN = null;
    setUser(null);
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
