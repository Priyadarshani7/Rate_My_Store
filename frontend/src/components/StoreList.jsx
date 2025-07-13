import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function StoreList() {
  const { token } = useAuth();
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
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Stores List</h2>
      {error && <div className="text-red-600">{error}</div>}
      <ul>
        {stores.map((store) => (
          <li key={store.id} className="mb-4 border-b pb-2">
            <div className="font-semibold">{store.name}</div>
            <div>{store.email}</div>
            <div>{store.address}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
