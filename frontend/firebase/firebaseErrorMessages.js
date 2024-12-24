const firebaseErrorMessages = {
    "auth/user-not-found": "No user found with this email.",
    "auth/wrong-password": "The password is incorrect.",
    "auth/email-already-in-use": "This email is already in use.",
    "auth/invalid-email": "The email address is invalid.",
    "auth/weak-password": "The password is too weak.",
    "auth/network-request-failed": "Network error occurred. Please try again.",
    "auth/popup-closed-by-user": "Sign-in popup was closed before completing the sign-in process.",
    // Add more error mappings as needed.
};

export const getFirebaseErrorMessage = (errorCode) => {
    return firebaseErrorMessages[errorCode] || "An unexpected error occurred.";
};
