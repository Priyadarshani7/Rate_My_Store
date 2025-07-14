import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StoreList() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStores() {
      try {
        const response = await fetch("http://localhost:3000/api/stores", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch stores");
        const data = await response.json();
        setStores(data);
      } catch (err) {
        setError("Error loading stores");
      }
    }
    fetchStores();
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Stores List</h2>
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-gray-50 rounded-lg shadow p-4 flex flex-col"
          >
            <div className="font-semibold text-lg mb-2">{store.name}</div>
            <div className="text-sm text-gray-700 font-medium  mb-1">
              Contact Store: {store.email}
            </div>
            <div className="text-sm text-gray-700 font-medium  mb-1">
              Store Address: {store.address}
            </div>
            <div className="text-sm text-gray-900 font-medium mt-auto">
              Average Rating: {store.average_rating}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
