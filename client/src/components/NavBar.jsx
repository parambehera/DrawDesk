import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full sticky top-0 z-50">
      {/* Glass Navbar */}
      <div className="w-full bg-white/50 backdrop-blur-xl border-b border-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <div className="w-full px-6 md:px-14 lg:px-20 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              DrawDesk
            </span>
          </Link>

          {/* Right Side Buttons */}
          <div className="flex gap-3 items-center">
            {user && (
              <>
                <span className="text-gray-700 font-medium hidden sm:block">
                  {user.name}
                </span>

                <button
                  className="px-5 py-2 rounded-full  bg-red-400 text-white font-medium shadow hover:bg-red-500 transition cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                {/* Login button */}
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full border border-blue-400 text-blue-700 font-medium bg-white/50 hover:bg-blue-50 transition"
                >
                  Login
                </Link>

                {/* Register button */}
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:opacity-95 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
