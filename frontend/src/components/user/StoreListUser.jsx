import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StoreList() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [userRatings, setUserRatings] = useState({}); // storeId: rating

  useEffect(() => {
    async function fetchStores() {
      try {
        console.log("Token used for /api/stores:", token); // Debug log
        const params = new URLSearchParams();
        if (filters.name) params.append("name", filters.name);
        if (filters.address) params.append("address", filters.address);
        const response = await fetch(
          `http://localhost:3000/api/stores?${params}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch stores");
        const data = await response.json();
        setStores(data);
      } catch (err) {
        setError("Error loading stores");
      }
    }
    fetchStores();
  }, [token, filters]);

  useEffect(() => {
    async function fetchUserRatings() {
      if (!user) return;
      try {
        const response = await fetch(
          `http://localhost:3000/api/ratings/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch ratings");
        const data = await response.json();
        // Map: storeId -> rating
        const ratingsMap = {};
        data.forEach((r) => {
          ratingsMap[r.store_id] = r.rating;
        });
        setUserRatings(ratingsMap);
      } catch (err) {
        // ignore error
      }
    }
    fetchUserRatings();
  }, [token, user]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleRatingChange = async (storeId, rating) => {
    try {
      const response = await fetch("http://localhost:3000/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ storeId, rating }),
      });
      if (!response.ok) throw new Error("Failed to submit rating");
      setUserRatings({ ...userRatings, [storeId]: rating });
    } catch (err) {
      setError("Error submitting rating");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Stores List</h2>
      </div>
      {/* Add filters for name and address */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <input
          name="name"
          value={filters.name}
          onChange={handleChange}
          placeholder="Search by Name"
          className="px-2 py-1 border rounded"
        />
        <input
          name="address"
          value={filters.address}
          onChange={handleChange}
          placeholder="Search by Address"
          className="px-2 py-1 border rounded"
        />
      </div>
      {error && null}
      {/* Card grid for stores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-gray-50 rounded-lg shadow p-4 flex flex-col"
          >
            <div className="font-semibold text-lg mb-2">{store.name}</div>
            <div className="text-sm text-gray-700 mb-1">{store.address}</div>
            <div className="text-sm text-gray-900 font-medium mb-2">
              Overall Rating: {store.average_rating}
            </div>
            <div className="text-sm text-gray-900 mb-2">
              Your Rating:{" "}
              {userRatings[store.id] ? (
                <>
                  <span>{userRatings[store.id]}</span>
                  <button
                    className="ml-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() =>
                      setUserRatings({ ...userRatings, [store.id]: null })
                    }
                  >
                    Modify
                  </button>
                </>
              ) : (
                <RatingInput
                  onSubmit={(rating) => handleRatingChange(store.id, rating)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RatingInput({ onSubmit }) {
  const [rating, setRating] = useState(1);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(rating);
      }}
      className="inline-flex items-center gap-2"
    >
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border rounded px-2 py-1"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
      >
        Submit
      </button>
    </form>
  );
}
