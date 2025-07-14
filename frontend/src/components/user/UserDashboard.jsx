import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">User Dashboard</h2>
        </div>
        <div className="mb-4">
          <strong>Welcome:</strong> {user?.firstName} {user?.lastName}
        </div>
        <div className="mb-2">
          <strong>Email:</strong> {user?.email}
        </div>
        <div className="mb-2">
          <strong>Address:</strong> {user?.address}
        </div>
        <div className="mb-2">
          <strong>Role:</strong> {user?.role}
        </div>
        <div className="mt-6">
          <a
            href="/stores"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            View Stores
          </a>
          <a
            href="/update-password"
            className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Update Password
          </a>
        </div>
      </div>
    </div>
  );
}
