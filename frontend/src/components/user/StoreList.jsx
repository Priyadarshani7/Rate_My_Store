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
      const response = await fetch(`http://localhost:3000/api/ratings`, {
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
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Stores List</h2>
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
      {error && <div className="text-red-600">{error}</div>}
      <ul>
        {stores.map((store) => (
          <li key={store.id} className="mb-4 border-b pb-2">
            <div className="font-semibold">{store.name}</div>
            <div>{store.address}</div>
            <div>Overall Rating: {store.average_rating}</div>
            <div>
              Your Rating:{" "}
              {userRatings[store.id] ? (
                <>
                  <span>{userRatings[store.id]}</span>
                  <button
                    className="ml-2 text-blue-600 underline"
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
          </li>
        ))}
      </ul>
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
