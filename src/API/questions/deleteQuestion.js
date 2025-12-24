/**
 * API для работы с вопросами
 * @module API/questions/deleteQuestion
 */

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";

/**
 * Удаляет вопрос из Firestore
 * @param {string} questionId - ID вопроса для удаления
 * @returns {Promise<void>}
 * @throws {Error} В случае ошибки при удалении из базы данных
 */
export const deleteQuestion = async (questionId) => {
  try {
    await deleteDoc(doc(db, "questions", questionId));
  } catch (error) {
    throw error;
  }
};
