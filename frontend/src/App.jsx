import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import AdminDashboard from "./components/admin/AdminDashboard";
import Dashboard from "./components/user/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import CreateStore from "./components/admin/CreateStore";
import StoreList from "./components/StoreList";

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
        <Route path="/admin/*" element={<AdminDashboard />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/admin/stores" element={<CreateStore />} />

        <Route path="/stores" element={<StoreList />} />

        <Route path="/allstores" element={<StoreList />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
