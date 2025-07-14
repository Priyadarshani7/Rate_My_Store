import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Helper to format role for welcome message
  const getRoleLabel = (role) => {
    if (role === "system_administrator") return "Admin";
    if (role === "store_owner") return "Store Owner";
    if (role === "normal_user") return "User";
    return "";
  };

  return (
    <nav className="bg-blue-700 shadow-sm mb-4 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Welcome message on the left */}
          <div className="flex items-center min-w-[180px]">
            {user && (
              <span className="text-white font-semibold">
                Welcome, {getRoleLabel(user.role)}{" "}
                {user.firstName || user.email}
              </span>
            )}
          </div>
          {/* Nav links centered */}
          <div className="flex-1 flex justify-center">
            <div className="flex gap-6">
              {user?.role === "system_administrator" && (
                <>
                  <Link
                    to="/admin/stores/create"
                    className="text-white hover:text-blue-200"
                  >
                    Add Stores
                  </Link>
                  <Link
                    to="/admin/stores"
                    className="text-white hover:text-blue-200"
                  >
                    View Stores
                  </Link>

                  <Link
                    to="/admin/users/create"
                    className="text-white hover:text-blue-200"
                  >
                    Add Users
                  </Link>
                  <Link
                    to="/admin/users"
                    className="text-white hover:text-blue-200"
                  >
                    View Users
                  </Link>
                </>
              )}
              {user?.role === "normal_user" && (
                <>
                  <Link
                    to="/dashboard"
                    className="font-bold text-white hover:text-blue-200"
                  >
                    Dashboard
                  </Link>
                  <Link to="/stores" className="text-white hover:text-blue-200">
                    Stores
                  </Link>
                  <Link
                    to="/update-password"
                    className="text-white hover:text-blue-200"
                  >
                    Update Password
                  </Link>
                </>
              )}
              {user?.role === "store_owner" && (
                <>
                  <Link
                    to="/store/dashboard"
                    className="font-bold text-white hover:text-blue-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/store/update-password"
                    className="text-white hover:text-blue-200"
                  >
                    Update Password
                  </Link>
                </>
              )}
            </div>
          </div>
          {/* Logout button on the right */}
          <div className="flex items-center min-w-[120px] justify-end">
            {user && (
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium "
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
