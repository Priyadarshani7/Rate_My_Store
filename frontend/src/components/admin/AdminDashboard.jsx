import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-2xl font-bold mb-4">Admin Controls</h2>
            <p className="text-gray-600">
              This is a protected admin area. Only users with admin privileges
              can access this page.
            </p>
            {stats && (
              <div className="mb-4">
                <div>
                  <strong>Total Users:</strong> {stats.totalUsers}
                </div>
                <div>
                  <strong>Total Stores:</strong> {stats.totalStores}
                </div>
                <div>
                  <strong>Total Ratings:</strong> {stats.totalRatings}
                </div>
              </div>
            )}
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
