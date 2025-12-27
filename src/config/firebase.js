/**
 * Firebase Configuration Module
 *
 * Инициализирует и экспортирует сервисы Firebase:
 * - Authentication (auth)
 * - Cloud Firestore (db)
 * - Firebase App instance (default export)
 *
 * @module config/firebase
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Конфигурация Firebase проекта
 * Использует переменные окружения, если они заданы, иначе значения по умолчанию
 * @type {Object}
 */
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA3K2xyG0DXKwCcYajXE_LUaIx3bekbt2I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "most-d17d9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "most-d17d9",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "most-d17d9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "681745157668",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID || "1:681745157668:web:f69b5ba2ab1355f71ad2b1",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-4G98V5Y8K9",
};

// Инициализация Firebase приложения
const app = initializeApp(firebaseConfig);

// Инициализация Firebase Authentication
export const auth = getAuth(app);

// Инициализация Cloud Firestore
export const db = getFirestore(app);

// Экспорт экземпляра приложения Firebase
export default app;
