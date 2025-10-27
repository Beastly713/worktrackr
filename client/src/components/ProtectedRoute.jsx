import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // If user is not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, show the page they're trying to access
  return children;
};

export default ProtectedRoute;