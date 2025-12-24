/**
 * API для работы с вопросами
 * @module API/questions/getQuestion
 */

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { logError, isNetworkError } from "../../utils/errorHandler";

/**
 * Получает вопрос по ID из Firestore
 * @param {string} questionId - ID вопроса
 * @returns {Promise<Object|null>} Объект вопроса с полем id и данными документа, или null если не найден
 * @throws {Error} В случае ошибки при запросе к базе данных
 */
export const getQuestion = async (questionId) => {
  try {
    const docRef = doc(db, "questions", questionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    logError(error, "Ошибка получения вопроса", !isNetworkError(error));
    throw error;
  }
};
