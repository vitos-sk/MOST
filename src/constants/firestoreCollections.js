/**
 * Firestore Collections Constants
 *
 * Константы для названий коллекций в Firestore.
 * Централизованное хранение имен коллекций для избежания опечаток и упрощения рефакторинга.
 *
 * @module constants/firestoreCollections
 */

/**
 * Названия коллекций Firestore
 * @type {Object}
 */
export const COLLECTIONS = {
  CATEGORIES: "categories",
  QUESTIONS: "questions",
  USERS: "users",
  VOTES: "votes",
  ADMINS: "admins",
};

/**
 * Варианты выбора в вопросах
 * @type {Object}
 */
export const QUESTION_CHOICES = {
  OPTION_A: "A",
  OPTION_B: "B",
};
