// src/providers/AuthProvider.jsx
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
// 🔑 Import auth and googleProvider directly from your firebase config file
import { auth, googleProvider } from '../firebase/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Google Login Function
  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Logout Function
  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Monitor auth state changes (keeps user logged in on refresh)
 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    
    // 🚀 IF a user is actively logged in, sync their details to MongoDB
    if (currentUser) {
      const userInfo = {
        name: currentUser.displayName || "Anonymous User",
        email: currentUser.email,
        image: currentUser.photoURL || ""
      };

      try {
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userInfo)
        });
        
        const data = await response.json();
        console.log("📡 MongoDB Sync Status:", data.message);
      } catch (error) {
        console.error("❌ Failed to broadcast user payload to backend:", error);
      }
    }

    setLoading(false);
  });
  
  return () => unsubscribe();
}, []);

  const authInfo = {
    user,
    loading,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};