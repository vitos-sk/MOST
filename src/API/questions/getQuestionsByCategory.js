/**
 * API для работы с вопросами
 * @module API/questions/getQuestionsByCategory
 */

import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { logError, isNetworkError } from "../../utils/errorHandler";

/**
 * Получает все вопросы указанной категории из Firestore
 * @param {string} category - ID категории
 * @returns {Promise<Array<Object>>} Массив вопросов указанной категории с полями id и данными документа
 * @throws {Error} В случае ошибки при запросе к базе данных
 */
export const getQuestionsByCategory = async (category) => {
  try {
    const q = query(collection(db, "questions"), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    logError(error, "Ошибка получения вопросов по категории", !isNetworkError(error));
    throw error;
  }
};
