import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : 'http://localhost:5000';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // 🟢 1. Added state to track admin status
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userInfo = {
          name: currentUser.displayName || "Anonymous User",
          email: currentUser.email,
          image: currentUser.photoURL || ""
        };

        try {
          // Step A: Sync user metadata with MongoDB (Your existing logic)
          const response = await fetch(`${API_BASE_URL}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userInfo)
          });
          const data = await response.json();
          console.log("📡 MongoDB Sync Status:", data.message);

          // 🟢 2. Step B: Hit your custom backend route to verify admin status
          const adminResponse = await fetch(`${API_BASE_URL}/api/users/admin/${currentUser.email}`);
          const adminData = await adminResponse.json();
          
          // Your backend returns { admin: true/false }, so we look for adminData.admin
          setIsAdmin(adminData.admin); 

        } catch (error) {
          console.error("❌ Failed backend synchronization:", error);
          setIsAdmin(false);
        }

        // Set the Firebase user details last
        setUser(currentUser);
      } else {
        // Reset states completely on logout
        setUser(null);
        setIsAdmin(false);
      }

      // 🟢 3. Crucial: Only turn off loading AFTER the database checks finish
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    isAdmin, // 🟢 4. Exposed to the rest of your application
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