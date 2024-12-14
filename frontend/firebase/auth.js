import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

//Controller for API ENDPOINT
import axiosInstance from "@/config/axiosInstance";


export const getIdToken = async () => {
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  } else {
    throw new Error("No user is currently signed in.");
  }
};

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
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { uid } = userCredential.user;

    // Prepare user details for API
    const userDetails = {
      uid,
      email,
      firstName,
      lastName,
      telephone,
      branchId, // Pass branch as it is
      //image,  // Include image if provided
    };

    // console.log(userDetails.branch);

    // Send user details to the API endpoint
    const response = await axiosInstance.post(
      "/api/users",
      userDetails,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 201) {
      return {
        success: true,
        message: "User created successfully",
        user: response.data,
      };
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
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const { uid, email } = result.user;

        // Emit the UID and other session details
        sessionStorage.setItem('userLoggedInUid', uid);
        sessionStorage.setItem('userLoggedInEmail', email);

        localStorage.setItem("sessionToken", result.token);

    
        // userSessionEmitter.emit("userLoggedInUid", uid);
        // userSessionEmitter.emit("userLoggedInEmail", email);

    // Check if the user already exists via API
    const userResponse = await axiosInstance.get(
      `/api/users/?id=${uid}`
    );

    let user = userResponse.data;

    if (1===1) {
      // User doesn't exist in the local database
      userSessionEmitter.emit("userStatus", 0);
      return { success: false, redirect: "signupwg", uid, email };
    } else {
      // User exists, continue login
      userSessionEmitter.emit("userStatus", 1);
      return { success: true, user };
    }

  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const doSignOut = () => {
  return auth.signOut();
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
