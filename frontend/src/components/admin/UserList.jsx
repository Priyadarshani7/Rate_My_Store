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
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Address</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">
                {u.first_name} {u.last_name}
              </td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.address}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">
                <Link
                  to={`/admin/users/${u.id}`}
                  className="text-indigo-600 hover:underline"
                >
                  Details
                </Link>
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
  );
}
