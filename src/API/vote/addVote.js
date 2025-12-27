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
 * @param {string} choice - Выбор пользователя ('A', 'B' или 'C')
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

    const questionRef = doc(db, "questions", questionId);
    const fieldMap = {
      A: "votesOptionA",
      B: "votesOptionB",
      C: "votesOptionC",
    };

    if (!querySnapshot.empty) {
      // Пользователь уже голосовал - обновляем существующий голос
      const existingVote = querySnapshot.docs[0];
      const oldChoice = existingVote.data().choice;

      // Обновляем голос
      await updateDoc(existingVote.ref, {
        choice,
        timestamp: serverTimestamp(),
      });

      // Обновляем счетчики: уменьшаем старый, увеличиваем новый
      if (oldChoice !== choice) {
        const oldField = fieldMap[oldChoice];
        const newField = fieldMap[choice];

        const updates = {};
        if (oldField) {
          updates[oldField] = increment(-1);
        }
        if (newField) {
          updates[newField] = increment(1);
        }

        if (Object.keys(updates).length > 0) {
          await updateDoc(questionRef, updates);
        }
      }

      return { success: true };
    }

    // Добавляем новый голос
    await addDoc(collection(db, "votes"), {
      userId,
      questionId,
      choice, // 'A', 'B' или 'C'
      timestamp: serverTimestamp(),
    });

    // Обновляем счётчик голосов в вопросе
    const field = fieldMap[choice];
    if (field) {
      await updateDoc(questionRef, {
        [field]: increment(1),
      });
    }

    return { success: true };
  } catch (error) {
    logError(error, "Ошибка добавления голоса", !isNetworkError(error));
    throw error;
  }
};
