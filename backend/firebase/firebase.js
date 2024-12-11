// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  // projectId: "crb2k18",
  // storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  // appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Optional

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
const analytics = getAnalytics(app);

const auth = getAuth(app);

export {app,auth};