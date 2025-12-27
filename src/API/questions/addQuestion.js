/**
 * API для работы с вопросами
 * @module API/questions/addQuestion
 */

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";

/**
 * Добавляет новый вопрос в Firestore
 * @param {Object} questionData - Данные вопроса (category, code, optionA, optionB, optionC)
 * @returns {Promise<string>} ID созданного вопроса
 * @throws {Error} В случае ошибки при добавлении в базу данных
 */
export const addQuestion = async (questionData) => {
  try {
    const docRef = await addDoc(collection(db, "questions"), {
      ...questionData,
      createdAt: serverTimestamp(),
      votesOptionA: 0,
      votesOptionB: 0,
      votesOptionC: 0,
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};
