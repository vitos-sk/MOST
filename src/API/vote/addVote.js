/**
 * API для работы с голосами
 * @module API/vote/addVote
 */

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { logError, isNetworkError } from "../../utils/errorHandler";

/**
 * Добавляет голос пользователя за вопрос
 * Проверяет, не голосовал ли пользователь ранее, и обновляет счетчики голосов
 * @param {string} userId - ID пользователя
 * @param {string} questionId - ID вопроса
 * @param {string} choice - Выбор пользователя ('A' или 'B')
 * @returns {Promise<Object>} Объект с полем success (true/false) и message (если ошибка)
 * @throws {Error} В случае ошибки при добавлении голоса в базу данных
 */
export const addVote = async (userId, questionId, choice) => {
  try {
    // Проверяем, голосовал ли пользователь ранее
    const q = query(
      collection(db, "votes"),
      where("userId", "==", userId),
      where("questionId", "==", questionId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Пользователь уже голосовал
      return { success: false, message: "Вы уже голосовали" };
    }

    // Добавляем голос
    await addDoc(collection(db, "votes"), {
      userId,
      questionId,
      choice, // 'A' или 'B'
      timestamp: serverTimestamp(),
    });

    // Обновляем счётчик голосов в вопросе
    const questionRef = doc(db, "questions", questionId);
    const field = choice === "A" ? "votesOptionA" : "votesOptionB";
    await updateDoc(questionRef, {
      [field]: increment(1),
    });

    return { success: true };
  } catch (error) {
    logError(error, "Ошибка добавления голоса", !isNetworkError(error));
    throw error;
  }
};
