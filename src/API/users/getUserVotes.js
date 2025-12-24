/**
 * API для работы с пользователями
 * @module API/users/getUserVotes
 */

import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { logError, isNetworkError } from "../../utils/errorHandler";

/**
 * Получает все голоса пользователя из Firestore
 * @param {string} userId - ID пользователя
 * @returns {Promise<Array<Object>>} Массив голосов пользователя с полями id и данными документа
 * @throws {Error} В случае ошибки при запросе к базе данных
 */
export const getUserVotes = async (userId) => {
  try {
    const q = query(collection(db, "votes"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    logError(error, "Ошибка получения голосов пользователя", !isNetworkError(error));
    throw error;
  }
};
