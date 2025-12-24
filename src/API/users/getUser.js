/**
 * API для работы с пользователями
 * @module API/users/getUser
 */

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { logError, isNetworkError } from "../../utils/errorHandler";

/**
 * Получает данные пользователя по ID из Firestore
 * @param {string} userId - ID пользователя (telegramId)
 * @returns {Promise<Object|null>} Объект пользователя с полем id и данными документа, или null если не найден
 * @throws {Error} В случае ошибки при запросе к базе данных
 */
export const getUser = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    logError(error, "Ошибка получения пользователя", !isNetworkError(error));
    throw error;
  }
};
