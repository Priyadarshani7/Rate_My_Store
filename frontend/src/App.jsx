import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AdminDashboard from './components/admin/AdminDashboard';
import Dashboard from './components/user/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Wrapper component to handle auth-based redirections
function AuthWrapper({ children }) {
  const { user } = useAuth();
  
  // If user is already logged in, redirect based on role
  if (user) {
    if (user.role === 'system_administrator') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'store_owner') {
      return <Navigate to="/store" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
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

        {/* Protected routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['system_administrator']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['normal_user']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
