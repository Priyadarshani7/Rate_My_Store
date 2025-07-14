import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-2xl font-bold mb-4">Admin Controls</h2>
            <p className="text-gray-600">
              This is a protected admin area. Only users with admin privileges
              can access this page.
            </p>
            <Link
              to="/admin/stores"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Manage Stores
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
