/**
 * Утилита для добавления администратора в Firestore
 *
 * ВАЖНО: Этот файл предназначен для одноразового использования.
 * После добавления администратора через Firebase Console, этот файл можно удалить.
 *
 * Использование:
 * 1. Импортируйте функцию в консоли браузера или создайте временный компонент
 * 2. Вызовите: addAdminToFirestore('onlihash@gmail.com')
 * 3. Убедитесь, что пользователь создан в Firebase Authentication
 */

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../constants/firestoreCollections";

/**
 * Добавляет администратора в коллекцию admins
 * @param {string} email - Email администратора
 * @returns {Promise<void>}
 */
export const addAdminToFirestore = async (email) => {
  try {
    if (!email) {
      throw new Error("Email обязателен");
    }

    const adminRef = doc(db, COLLECTIONS.ADMINS, email);

    await setDoc(adminRef, {
      email: email,
      role: "admin",
      createdAt: serverTimestamp(),
    });

    // Администратор успешно добавлен
    return true;
  } catch (error) {
    // Ошибка при добавлении администратора
    throw error;
  }
};

// Для быстрого использования в консоли браузера
if (typeof window !== "undefined") {
  window.addAdmin = addAdminToFirestore;
}
