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
 * @type {Object}
 */
const firebaseConfig = {
  apiKey: "AIzaSyA3K2xyG0DXKwCcYajXE_LUaIx3bekbt2I",
  authDomain: "most-d17d9.firebaseapp.com",
  projectId: "most-d17d9",
  storageBucket: "most-d17d9.firebasestorage.app",
  messagingSenderId: "681745157668",
  appId: "1:681745157668:web:f69b5ba2ab1355f71ad2b1",
  measurementId: "G-4G98V5Y8K9",
};

// Инициализация Firebase приложения
const app = initializeApp(firebaseConfig);

// Инициализация Firebase Authentication
export const auth = getAuth(app);

// Инициализация Cloud Firestore
export const db = getFirestore(app);

// Экспорт экземпляра приложения Firebase
export default app;
