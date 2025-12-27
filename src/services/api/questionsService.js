/**
 * Questions Service
 * Handles all question-related operations
 */

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firestoreCollections";
import { BaseService } from "./baseService";

class QuestionsService extends BaseService {
  constructor() {
    super(COLLECTIONS.QUESTIONS);
  }

  /**
   * Create a new question
   * @param {Object} questionData - Question data
   * @returns {Promise<string>} Question ID
   */
  async create(questionData) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
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
  }

  /**
   * Get questions by category ID
   * @param {string} categoryId - Category ID
   * @returns {Promise<Array>} Array of questions in the category
   */
  async getByCategory(categoryId) {
    return this.queryByField("category", "==", categoryId);
  }

  /**
   * Get unanswered questions for a user in a category
   * @param {string} userId - User ID
   * @param {string} categoryId - Category ID
   * @param {Array} userVotes - Array of user votes (to avoid circular dependency)
   * @returns {Promise<Array>} Array of unanswered questions
   */
  async getUnansweredByCategory(userId, categoryId, userVotes = []) {
    try {
      const votedQuestionIds = new Set(userVotes.map((v) => v.questionId));

      // Get all questions in category
      const categoryQuestions = await this.getByCategory(categoryId);

      // Filter out answered questions
      return categoryQuestions.filter((q) => !votedQuestionIds.has(q.id));
    } catch (error) {
      throw error;
    }
  }
}

export const questionsService = new QuestionsService();
