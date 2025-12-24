/**
 * API для работы с голосами
 * @module API/vote/getVotesByQuestion
 */

import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { logError, isNetworkError } from "../../utils/errorHandler";

/**
 * Получает все голоса по указанному вопросу из Firestore
 * @param {string} questionId - ID вопроса
 * @returns {Promise<Array<Object>>} Массив голосов с полями id и данными документа (userId, questionId, choice, timestamp)
 * @throws {Error} В случае ошибки при запросе к базе данных
 */
export const getVotesByQuestion = async (questionId) => {
  try {
    const q = query(collection(db, "votes"), where("questionId", "==", questionId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    logError(error, "Ошибка получения голосов", !isNetworkError(error));
    throw error;
  }
};
