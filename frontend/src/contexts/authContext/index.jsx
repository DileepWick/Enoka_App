import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import axiosInstance from "@/config/axiosInstance";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [promptExtendSession, setPromptExtendSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Check token validity periodically
        try {
          const idToken = await firebaseUser.getIdToken(true);
          const decodedToken = await auth.currentUser.getIdTokenResult();
          const sessionExpiryTime = decodedToken.exp * 1000;
          const currentTime = Date.now();

          if (sessionExpiryTime - currentTime < 300000) {
            // 5 minutes before expiration
            setPromptExtendSession(true);
          }
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const extendSession = async () => {
    try {
      const response = await axiosInstance.post("/api/extend", {});
      const newToken = response.data.newToken;
      setUser({ ...user, idToken: newToken });
      setPromptExtendSession(false);
    } catch (error) {
      console.error("Error extending session:", error);
      signOut(auth);
    }
  };

  const value = {
    user,
    promptExtendSession,
    extendSession,
    loading,
    userLoggedIn: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
