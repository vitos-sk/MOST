/**
 * API для работы с категориями
 * @module API/categories/deleteCategory
 */

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";

/**
 * Удаляет категорию из Firestore
 * @param {string} categoryId - ID категории для удаления
 * @returns {Promise<void>}
 * @throws {Error} В случае ошибки при удалении из базы данных
 */
export const deleteCategory = async (categoryId) => {
  try {
    await deleteDoc(doc(db, "categories", categoryId));
  } catch (error) {
    throw error;
  }
};
