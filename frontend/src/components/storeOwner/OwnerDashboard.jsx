import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OwnerDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRatings() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/store-owner/ratings?ownerId=${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch ratings");
        const data = await response.json();
        setRatings(data.ratings);
        setAverage(data.average_rating);
      } catch (err) {
        setError("Error loading ratings");
      }
    }
    fetchRatings();
  }, [token, user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Store Owner Dashboard</h2>
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
        <div className="mb-4">
          <strong>Average Store Rating:</strong> {average}
        </div>
        <h3 className="text-xl font-semibold mb-2">User Ratings</h3>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">User Name</th>
              <th className="p-2">User Email</th>
              <th className="p-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((r) => (
              <tr key={r.user_id} className="border-t">
                <td className="p-2">{r.user_name}</td>
                <td className="p-2">{r.user_email}</td>
                <td className="p-2">{r.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
