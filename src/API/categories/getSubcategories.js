/**
 * API для работы с категориями
 * @module API/categories/getSubcategories
 */

import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { logError, isNetworkError } from "../../utils/errorHandler";

/**
 * Получает все подкатегории указанной категории из Firestore
 * @param {string} parentCategoryId - ID родительской категории
 * @returns {Promise<Array<Object>>} Массив подкатегорий с полями id и данными документа
 * @throws {Error} В случае ошибки при запросе к базе данных
 */
export const getSubcategories = async (parentCategoryId) => {
  try {
    const q = query(
      collection(db, "categories"),
      where("parentCategoryId", "==", parentCategoryId)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    logError(error, "Ошибка получения подкатегорий", !isNetworkError(error));
    throw error;
  }
};
