import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Whiteboard from "./pages/Whiteboard";
import NavBar from "./components/NavBar";
import HomePage from "./pages/Homepage";
import MobileBlocker from "./pages/MobileBlocker";

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/whiteboard');

  return (
    <>
      {!hideNavbar && <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MobileBlocker>
                <Dashboard />
              </MobileBlocker>
            </ProtectedRoute>
          }
        />
        <Route
          path="/whiteboard/:roomId"
          element={
            <ProtectedRoute>
              <MobileBlocker>
                <Whiteboard />
              </MobileBlocker>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
