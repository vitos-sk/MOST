import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA3K2xyG0DXKwCcYajXE_LUaIx3bekbt2I",
  authDomain: "most-d17d9.firebaseapp.com",
  projectId: "most-d17d9",
  storageBucket: "most-d17d9.firebasestorage.app",
  messagingSenderId: "681745157668",
  appId: "1:681745157668:web:f69b5ba2ab1355f71ad2b1",
  measurementId: "G-4G98V5Y8K9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional)
// const analytics = getAnalytics(app);

export default app;
