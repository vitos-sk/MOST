/**
 * Votes Service
 * Handles all vote-related operations
 */

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  increment,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firestoreCollections";
import { BaseService } from "./baseService";
import { logError, isNetworkError } from "../../utils/errorHandler";

class VotesService extends BaseService {
  constructor() {
    super(COLLECTIONS.VOTES);
  }

  /**
   * Get votes by question ID
   * @param {string} questionId - Question ID
   * @returns {Promise<Array>} Array of votes for the question
   */
  async getByQuestionId(questionId) {
    return this.queryByField("questionId", "==", questionId);
  }

  /**
   * Get votes by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of votes by the user
   */
  async getByUserId(userId) {
    return this.queryByField("userId", "==", userId);
  }

  /**
   * Add or update vote for a question
   * @param {string} userId - User ID
   * @param {string} questionId - Question ID
   * @param {string} choice - User's choice ('A', 'B', or 'C')
   * @returns {Promise<Object>} Result object with success flag
   */
  async addVote(userId, questionId, choice) {
    try {
      // Check if user already voted
      const q = query(
        collection(db, COLLECTIONS.VOTES),
        where("userId", "==", userId),
        where("questionId", "==", questionId)
      );
      const querySnapshot = await getDocs(q);

      const questionRef = doc(db, COLLECTIONS.QUESTIONS, questionId);
      const fieldMap = {
        A: "votesOptionA",
        B: "votesOptionB",
        C: "votesOptionC",
      };

      if (!querySnapshot.empty) {
        // User already voted - update existing vote
        const existingVote = querySnapshot.docs[0];
        const oldChoice = existingVote.data().choice;

        // Update vote
        await updateDoc(existingVote.ref, {
          choice,
          timestamp: serverTimestamp(),
        });

        // Update counters: decrement old, increment new
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

      // Add new vote
      await addDoc(collection(db, COLLECTIONS.VOTES), {
        userId,
        questionId,
        choice,
        timestamp: serverTimestamp(),
      });

      // Update vote counter in question
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
  }
}

export const votesService = new VotesService();
