import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OwnerDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [error, setError] = useState("");
  const [userNames, setUserNames] = useState({}); // userId: first_name

  useEffect(() => {
    async function fetchRatings() {
      try {
        // Fetch the store(s) owned by this user
        const storeRes = await fetch(
          `http://localhost:3000/api/stores?owner_id=${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!storeRes.ok) throw new Error("Failed to fetch store info");
        const stores = await storeRes.json();
        if (!stores.length) throw new Error("No store found for owner");
        // Use the first store's id (or handle multiple stores if needed)
        const storeId = stores[0].id;
        // Fetch ratings for this store using the correct route
        const response = await fetch(
          `http://localhost:3000/api/ratings/store/${storeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch ratings");
        const data = await response.json();
        setRatings(data);
        // Fetch first names for each user_id
        const names = {};
        for (const r of data) {
          if (!names[r.user_id]) {
            try {
              const res = await fetch(
                `http://localhost:3000/api/user/first_name/${r.user_id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (res.ok) {
                const nameData = await res.json();
                names[r.user_id] = nameData.first_name;
              }
            } catch {}
          }
        }
        setUserNames(names);
        // Calculate average rating
        if (data.length > 0) {
          const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
          setAverage(avg.toFixed(2));
        } else {
          setAverage(0);
        }
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
        </div>
        <div className="mb-4 text-lg">
          <strong>Average Store Rating:</strong>{" "}
          <span className="text-indigo-700 font-bold">{average}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">User Ratings</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 rounded-lg bg-white shadow">
            <thead>
              <tr className="bg-indigo-100 border-b border-gray-400">
                <th className="p-3 text-left border-r border-gray-400">
                  User ID
                </th>
                <th className="p-3 text-left border-r border-gray-400">
                  User Name
                </th>
                <th className="p-3 text-left">Rating</th>
              </tr>
            </thead>
            <tbody>
              {ratings.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No ratings yet.
                  </td>
                </tr>
              ) : (
                ratings.map((r) => (
                  <tr
                    key={r.user_id}
                    className="border-b border-gray-300 hover:bg-gray-50"
                  >
                    <td className="p-3 border-r border-gray-400">
                      {r.user_id}
                    </td>
                    <td className="p-3 border-r border-gray-400">
                      {userNames[r.user_id] || ""}
                    </td>
                    <td className="p-3">{r.rating}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
