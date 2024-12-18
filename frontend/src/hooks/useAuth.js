// src/hooks/useAuth.js

import { useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  getIdToken,
} from "firebase/auth";
import axios from "axios";
import axiosInstance from "@/config/axiosInstance";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [promptExtendSession, setPromptExtendSession] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Check token validity periodically
        const idToken = await firebaseUser.getIdToken(true);
        const decodedToken = await auth.currentUser.getIdTokenResult();
        const sessionExpiryTime = decodedToken.exp * 1000;
        const currentTime = Date.now();

        if (sessionExpiryTime - currentTime < 300000) {
          // 5 minutes before expiration
          setPromptExtendSession(true);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const extendSession = async () => {
    try {
      const response = await axiosInstance.post("/api/extend", {});

      // Update user session with the new token
      const newToken = response.data.newToken;
      setUser({ ...user, idToken: newToken });
      setPromptExtendSession(false);
    } catch (error) {
      console.error("Error extending session:", error);
      signOut(auth);
    }
  };

  return { user, promptExtendSession, extendSession };
};

export default useAuth;
