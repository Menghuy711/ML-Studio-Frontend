import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to home with redirect intent
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
  }

  return children;
}
