import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import AdminDashboard from "./components/admin/AdminDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import CreateStore from "./components/admin/CreateStore";
import StoreList from "./components/admin/StoreList";
import UserList from "./components/admin/UserList";
import UserDetails from "./components/admin/UserDetails";
import CreateUser from "./components/admin/CreateUser";
import UserDashboard from "./components/user/UserDashboard";
import UpdatePassword from "./components/user/UpdatePassword";

// Wrapper component to handle auth-based redirections
function AuthWrapper({ children }) {
  const { user } = useAuth();
  // Only block access if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <AuthWrapper>
              <Login />
            </AuthWrapper>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthWrapper>
              <Signup />
            </AuthWrapper>
          }
        />

        {/* All protected routes accessible to any logged-in user */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/users/create" element={<CreateUser />} />
        <Route path="/admin/users/:id" element={<UserDetails />} />
        <Route path="/admin/stores" element={<CreateStore />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["normal_user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stores"
          element={
            <ProtectedRoute allowedRoles={["normal_user"]}>
              <StoreList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-password"
          element={
            <ProtectedRoute allowedRoles={["normal_user"]}>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />

        <Route path="/allstores" element={<StoreList />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
