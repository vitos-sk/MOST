/**
 * API для проверки прав администратора
 * @module API/admin/checkAdmin
 */

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firestoreCollections";

/**
 * Проверяет, является ли пользователь администратором
 * @param {string} email - Email пользователя
 * @returns {Promise<boolean>} true, если пользователь является администратором
 */
export const checkAdmin = async (email) => {
  try {
    if (!email) return false;

    const adminRef = doc(db, COLLECTIONS.ADMINS, email);
    const adminSnap = await getDoc(adminRef);

    return adminSnap.exists();
  } catch (error) {
    return false;
  }
};
