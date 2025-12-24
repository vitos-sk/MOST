/**
 * API для работы с категориями
 * @module API/categories/getCategories
 */

import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { logError, isNetworkError } from "../../utils/errorHandler";

/**
 * Получает список всех категорий из Firestore
 * @returns {Promise<Array<Object>>} Массив категорий с полями id и данными документа
 * @throws {Error} В случае ошибки при запросе к базе данных
 */
export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    logError(error, "Ошибка получения категорий", !isNetworkError(error));
    throw error;
  }
};
