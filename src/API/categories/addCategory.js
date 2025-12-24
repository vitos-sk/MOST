/**
 * API для работы с категориями
 * @module API/categories/addCategory
 */

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";

/**
 * Добавляет новую категорию в Firestore
 * @param {Object} categoryData - Данные категории (name, emoji и т.д.)
 * @returns {Promise<string>} ID созданной категории
 * @throws {Error} В случае ошибки при добавлении в базу данных
 */
export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      ...categoryData,
      createdAt: serverTimestamp(),
      questionsCount: 0,
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};
