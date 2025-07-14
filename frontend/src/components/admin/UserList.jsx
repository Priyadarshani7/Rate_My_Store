import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function UserList() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
          if (val) params.append(key, val);
        });
        const response = await fetch(
          `http://localhost:3000/api/admin/users?${params}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          const errMsg = await response.text();
          setError(`Error loading users: ${response.status} ${errMsg}`);
          setUsers([]);
          return;
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError("Error loading users: " + err.message);
      }
    }
    fetchUsers();
  }, [token, filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Users List</h2>
      <div className="mb-4 flex gap-2 flex-wrap">
        <input
          name="name"
          value={filters.name}
          onChange={handleChange}
          placeholder="Name"
          className="px-2 py-1 border rounded"
        />
        <input
          name="email"
          value={filters.email}
          onChange={handleChange}
          placeholder="Email"
          className="px-2 py-1 border rounded"
        />
        <input
          name="address"
          value={filters.address}
          onChange={handleChange}
          placeholder="Address"
          className="px-2 py-1 border rounded"
        />
        <select
          name="role"
          value={filters.role}
          onChange={handleChange}
          className="px-2 py-1 border rounded"
        >
          <option value="">All Roles</option>
          <option value="system_administrator">Admin</option>
          <option value="normal_user">Normal User</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border border-gray-400 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-400">
            <th className="p-2 text-left border-r border-gray-400">Name</th>
            <th className="p-2 text-left border-r border-gray-400">Email</th>
            <th className="p-2 text-left border-r border-gray-400">Address</th>
            <th className="p-2 text-left border-r border-gray-400">Role</th>
            <th className="p-2 text-center">Details</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="hover:bg-gray-50 border-b border-gray-400"
            >
              <td className="p-2 border-r border-gray-400">
                <div className="flex flex-col">
                  <span>
                    {u.first_name} {u.last_name}
                  </span>
                </div>
              </td>
              <td className="p-2 border-r border-gray-400">
                <div className="flex flex-col">
                  <span>{u.email}</span>
                </div>
              </td>
              <td className="p-2 border-r border-gray-400">
                <div className="flex flex-col">
                  <span>{u.address}</span>
                </div>
              </td>
              <td className="p-2 border-r border-gray-400">
                <div className="flex flex-col">
                  <span>{u.role}</span>
                </div>
              </td>
              <td className="p-2 text-center">
                <button
                  className="text-indigo-600 hover:text-indigo-900"
                  title="View Details"
                  onClick={() => setSelectedUser(u)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 16v-4m0-4h.01"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link
        to="/admin/users/create"
        className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Add User
      </Link>

      {/* User details modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedUser(null)}
              title="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">User Details</h3>
            <div className="mb-2">
              <strong>Name:</strong> {selectedUser.first_name}{" "}
              {selectedUser.last_name}
            </div>
            <div className="mb-2">
              <strong>Email:</strong> {selectedUser.email}
            </div>
            <div className="mb-2">
              <strong>Address:</strong> {selectedUser.address}
            </div>
            <div className="mb-2">
              <strong>Role:</strong> {selectedUser.role}
            </div>
            {selectedUser.role === "store_owner" && (
              <div className="mb-2">
                <strong>Average Rating:</strong> {selectedUser.average_rating}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
