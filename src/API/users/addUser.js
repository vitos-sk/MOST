/**
 * API для работы с пользователями
 * @module API/users/addUser
 */

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { logError, isNetworkError } from "../../utils/errorHandler";

/**
 * Добавляет нового пользователя в Firestore (если его еще нет)
 * @param {Object} userData - Данные пользователя (telegramId, firstName, lastName, username, languageCode, isPremium, photoUrl)
 * @returns {Promise<string>} ID пользователя (telegramId)
 * @throws {Error} В случае ошибки при добавлении в базу данных
 */
export const addUser = async (userData) => {
  try {
    const userId = userData.telegramId || userData.id;
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        telegramId: userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        languageCode: userData.languageCode,
        isPremium: userData.isPremium || false,
        photoUrl: userData.photoUrl,
        createdAt: serverTimestamp(),
      });
    }

    return userId;
  } catch (error) {
    logError(error, "Ошибка добавления пользователя", !isNetworkError(error));
    throw error;
  }
};
