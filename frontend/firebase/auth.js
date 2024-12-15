import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

//Controller for API ENDPOINT
import axiosInstance from "@/config/axiosInstance";


onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in
    const token = await user.getIdToken();
    const refreshToken = user.refreshToken;

    // Store tokens in sessionStorage or cookies
    sessionStorage.setItem("sessionToken", token);
    sessionStorage.setItem("refreshToken", refreshToken);
    sessionStorage.setItem("userLoggedInUid", user.uid);
    sessionStorage.setItem("userLoggedInEmail", user.email);

    console.log("User signed in:", user);
  } else {
    // User is signed out
    sessionStorage.clear();
    console.log("User signed out.");
  }
});



export const doCreateUserWithEmailAndPassword = async (
  email,
  password,
  firstName,
  lastName,
  telephone,
  branchId,
  image
) => {
  try {
    // Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    // Automatically log in the user
    const token = await userCredential.user.getIdToken();
    sessionStorage.setItem("sessionToken", token);
    sessionStorage.setItem("userLoggedInUid", uid);

    // Prepare user details for API
    const userDetails = { uid, email, firstName, lastName, telephone, branchId, image };

    // Send user details to your backend
    const response = await axiosInstance.post("/api/users", userDetails, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 201) {
      return { success: true, message: "User created successfully", user: response.data };
    } else {
      throw new Error(`Failed to create user: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};


export const doUpdateUserSignInWithGoogle = async (
  firstName,
  lastName,
  telephone,
  branchId,
  image
) => {
  try {

    const uUid=sessionStorage.getItem('userLoggedInUid');
    const uEmail=sessionStorage.getItem('userLoggedInEmail');
    const uStatus=0;


    if (uStatus === 0) {
      // Prepare user details for API
      const userDetails = {
        uid : uUid,
        email : uEmail,
        firstName,
        lastName,
        telephone,
        branchId, // Pass branch as it is
        //image,  // Include image if provided
      };

      // Send user details to the API endpoint
      const response = await axiosInstance.post(
        "/api/users",
        userDetails,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        userSessionEmitter.emit("userStatus", 1);
        return {
          success: true,
          message: "User updated successfully",
          user: response.data,
        };
      } else {
        throw new Error(`Failed to update user: ${response.data.message}`);
      }
    }else{
      throw new Error(`User already registered.`);
    }
  } catch (error) {
    console.error("Error creating user:"+uUid+uEmail, error);
    throw error;
  }
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  try {
    // Ensure session persists
    await setPersistence(auth, browserLocalPersistence);

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const { uid, email } = result.user;

    // Tokens are automatically managed by Firebase; no need to manually handle them here
    sessionStorage.setItem("userLoggedInUid", uid);
    sessionStorage.setItem("userLoggedInEmail", email);

    // API Call Example
    const userResponse = await axiosInstance.get(`/api/users/?id=${uid}`);
    const user = userResponse.data;

    if (!user) {
      sessionStorage.setItem("userStatus", "0"); // Not registered
      return { success: false, redirect: "signupwg", uid, email };
    } else {
      sessionStorage.setItem("userStatus", "1"); // Registered
      return { success: true, user };
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const doSignOut = async () => {
  try {
    await auth.signOut();
    sessionStorage.clear();
    console.log("User signed out.");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/`,
  });
};

export const getFreshToken = async () => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken(true); // Force refresh
    sessionStorage.setItem("sessionToken", token);
    return token;
  } else {
    throw new Error("No user is currently signed in.");
  }
};


export const getUserSession = () => {
  return {
    uid: sessionStorage.getItem("userLoggedInUid"),
    email: sessionStorage.getItem("userLoggedInEmail"),
    token: sessionStorage.getItem("sessionToken"),
  };
};


export const getIdToken = async () => {
  if (auth.currentUser) {
    try {
      return await auth.currentUser.getIdToken(true); // Fetch a fresh token
    } catch (error) {
      console.error("Error fetching ID token:", error);
      throw error;
    }
  } else {
    throw new Error("User is not authenticated.");
  }
};