import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import AdminDashboard from "./components/admin/AdminDashboard";
import { useAuth } from "./context/AuthContext";
import CreateStore from "./components/admin/CreateStore";
import StoreList from "./components/admin/StoreList";
import UserList from "./components/admin/UserList";
import UserDetails from "./components/admin/UserDetails";
import CreateUser from "./components/admin/CreateUser";
import UserDashboard from "./components/user/UserDashboard";
import UpdatePassword from "./components/user/UpdatePassword";
import OwnerDashboard from "./components/storeOwner/OwnerDashboard";
import StoreOwnerUpdatePassword from "./components/storeOwner/UpdatePassword";
import Navbar from "./components/shared/Navbar"; // Import the Navbar component

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="pt-20">
        {" "}
        {/* Add top padding to push content below navbar */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* All routes accessible to any user */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/users/create" element={<CreateUser />} />
          <Route path="/admin/users/:id" element={<UserDetails />} />
          <Route path="/admin/stores" element={<StoreList />} />
          <Route path="/admin/stores/create" element={<CreateStore />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/stores" element={<StoreList />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          {/* Store Owner routes */}
          <Route path="/store/dashboard" element={<OwnerDashboard />} />
          <Route
            path="/store/update-password"
            element={<StoreOwnerUpdatePassword />}
          />
          <Route path="/allstores" element={<StoreList />} />
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
