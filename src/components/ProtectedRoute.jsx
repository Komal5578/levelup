import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase.config';
import Loading from '../pages/Loading';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check Firebase authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated
        setAuthenticated(true);
        
        // Ensure user data is in localStorage
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        };
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // User is not authenticated
        setAuthenticated(false);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Show loading screen while checking authentication
  if (loading) {
    return <Loading />;
  }

  // Redirect to login if not authenticated
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content if authenticated
  return children;
};

export default ProtectedRoute;
