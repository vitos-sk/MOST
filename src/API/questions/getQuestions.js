/**
 * API для работы с вопросами
 * @module API/questions/getQuestions
 */

import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { logError, isNetworkError } from "../../utils/errorHandler";

/**
 * Получает список всех вопросов из Firestore
 * @returns {Promise<Array<Object>>} Массив вопросов с полями id и данными документа
 * @throws {Error} В случае ошибки при запросе к базе данных
 */
export const getQuestions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "questions"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    logError(error, "Ошибка получения вопросов", !isNetworkError(error));
    throw error;
  }
};
