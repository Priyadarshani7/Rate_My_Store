import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("http://localhost:3000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError("Error loading stats");
      }
    }
    fetchStats();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                Welcome, {user && user.firstName ? user.firstName : "User"}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-2xl font-bold mb-4">Admin Controls</h2>
            <p className="text-gray-600 mb-4">
              This is a protected admin area. Only users with admin privileges
              can access this page.
            </p>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {stats && (
              <ul className="mb-4">
                <li>Total Users: {stats.totalUsers}</li>
                <li>Total Stores: {stats.totalStores}</li>
                <li>Total Ratings: {stats.totalRatings}</li>
              </ul>
            )}
            <div className="flex gap-4 mb-6">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => navigate("/admin/stores/create")}
              >
                Create Store
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => navigate("/admin/stores")}
              >
                View Store List
              </button>
            </div>
            <div className="flex gap-4">
              <Link
                to="/admin/stores"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Manage Stores
              </Link>
              <Link
                to="/admin/users"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Manage Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
