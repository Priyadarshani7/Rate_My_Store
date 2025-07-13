import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/admin/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError("Error loading user details");
      }
    }
    fetchUser();
  }, [id, token]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      <div className="mb-2">
        <strong>Name:</strong> {user.first_name} {user.last_name}
      </div>
      <div className="mb-2">
        <strong>Email:</strong> {user.email}
      </div>
      <div className="mb-2">
        <strong>Address:</strong> {user.address}
      </div>
      <div className="mb-2">
        <strong>Role:</strong> {user.role}
      </div>
      {user.role === "store_owner" && (
        <div className="mb-2">
          <strong>Average Rating:</strong> {user.average_rating}
        </div>
      )}
    </div>
  );
}
