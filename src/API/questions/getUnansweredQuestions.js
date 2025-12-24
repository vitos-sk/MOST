/**
 * API для работы с вопросами
 * @module API/questions/getUnansweredQuestions
 */

import { getUserVotes } from "../users/getUserVotes";
import { getQuestionsByCategory } from "./getQuestionsByCategory";
import { logError, isNetworkError } from "../../utils/errorHandler";

/**
 * Получает список неотвеченных вопросов пользователя в указанной категории
 * @param {string} userId - ID пользователя
 * @param {string} categoryId - ID категории
 * @returns {Promise<Array<Object>>} Массив неотвеченных вопросов в категории
 * @throws {Error} В случае ошибки при запросе к базе данных
 */
export const getUnansweredQuestions = async (userId, categoryId) => {
  try {
    // Получить все голоса пользователя
    const userVotes = await getUserVotes(userId);
    const votedQuestionIds = new Set(userVotes.map((v) => v.questionId));

    // Получить все вопросы в категории
    const categoryQuestions = await getQuestionsByCategory(categoryId);

    // Фильтруем - только неотвеченные
    return categoryQuestions.filter((q) => !votedQuestionIds.has(q.id));
  } catch (error) {
    logError(error, "Ошибка получения неотвеченных вопросов", !isNetworkError(error));
    throw error;
  }
};
