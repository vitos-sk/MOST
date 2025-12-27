/**
 * API Module - Централизованный экспорт всех API функций
 *
 * Модуль предоставляет единую точку доступа ко всем API функциям:
 * - Categories: работа с категориями
 * - Questions: работа с вопросами
 * - Users: работа с пользователями
 * - Votes: работа с голосами
 *
 * @module API
 */

// Categories API
export { getCategories } from "./categories/getCategories";
export { getSubcategories } from "./categories/getSubcategories";
export { addCategory } from "./categories/addCategory";
export { deleteCategory } from "./categories/deleteCategory";
export { getCategoryName } from "./categories/getCategoryName";

// Questions API
export { getUnansweredQuestions } from "./questions/getUnansweredQuestions";
export { getQuestionsByCategory } from "./questions/getQuestionsByCategory";
export { getQuestion } from "./questions/getQuestion";
export { getQuestions } from "./questions/getQuestions";
export { addQuestion } from "./questions/addQuestion";
export { deleteQuestion } from "./questions/deleteQuestion";

// Users API
export { getUserVotes } from "./users/getUserVotes";
export { getUser } from "./users/getUser";
export { addUser } from "./users/addUser";

// Votes API
export { addVote } from "./vote/addVote";
export { getVotesByQuestion } from "./vote/getVotesByQuestion";

// Admin API
export { checkAdmin } from "./admin/checkAdmin";
