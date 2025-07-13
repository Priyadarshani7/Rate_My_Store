import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex gap-4">
            <Link to="/admin/dashboard" className="font-bold">
              Dashboard
            </Link>
            <Link to="/admin/stores">Stores</Link>
            <Link to="/admin/stores/create">Add Store</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/users/create">Add User</Link>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-gray-700">
                {user.firstName || user.email}
              </span>
            )}
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
