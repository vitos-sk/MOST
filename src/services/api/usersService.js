/**
 * Users Service
 * Handles all user-related operations
 */

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firestoreCollections";
import { logError, isNetworkError } from "../../utils/errorHandler";

class UsersService {
  constructor() {
    this.collectionName = COLLECTIONS.USERS;
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID (telegramId)
   * @returns {Promise<Object|null>} User data or null
   */
  async getById(userId) {
    try {
      const userRef = doc(db, this.collectionName, userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return {
          id: userSnap.id,
          ...userSnap.data(),
        };
      }
      return null;
    } catch (error) {
      logError(error, "Ошибка получения пользователя", !isNetworkError(error));
      throw error;
    }
  }

  /**
   * Create or get existing user
   * @param {Object} userData - User data
   * @returns {Promise<string>} User ID
   */
  async create(userData) {
    try {
      const userId = userData.telegramId || userData.id;
      const userRef = doc(db, this.collectionName, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          ...userData,
          createdAt: serverTimestamp(),
        });
      }
      return userId;
    } catch (error) {
      logError(error, "Ошибка создания пользователя", !isNetworkError(error));
      throw error;
    }
  }

  /**
   * Get user votes
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of user votes
   */
  async getUserVotes(userId) {
    try {
      // Use dynamic import to avoid circular dependency
      const { votesService } = await import("./votesService");
      return votesService.getByUserId(userId);
    } catch (error) {
      logError(error, "Ошибка получения голосов пользователя", !isNetworkError(error));
      throw error;
    }
  }
}

export const usersService = new UsersService();
