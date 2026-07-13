
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';

import { auth, googleProvider } from '../firebase/firebase';


const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : 'http://localhost:5000';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
      setUser(currentUser);
      
      
      if (currentUser) {
        const userInfo = {
          name: currentUser.displayName || "Anonymous User",
          email: currentUser.email,
          image: currentUser.photoURL || ""
        };

        try {
          
          const response = await fetch(`${API_BASE_URL}/api/users`, {
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