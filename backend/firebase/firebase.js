// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getAnalytics } from "@firebase/analytics";

// Load environment variables from .env file
// require('dotenv').config();

// Access environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDu86sYx4KsyojdCaq7x_CHCMKdrV-vBdQ",
  authDomain: "crb2k18.firebaseapp.com",
  databaseURL: "https://crb2k18.firebaseio.com",
  projectId: "crb2k18",
  storageBucket: "crb2k18.firebasestorage.app",
  messagingSenderId: "770326372555",
  appId: "1:770326372555:web:a460ba8ed79450d949bb4e",
  measurementId: "G-V65ZGCNJHP"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app); // Optional: Only needed if you're using analytics

// Export Firebase app and auth
export { app, auth, analytics };
