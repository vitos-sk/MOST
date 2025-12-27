/**
 * Admin Service
 * Handles admin-related operations
 */

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firestoreCollections";
import { logError, isNetworkError } from "../../utils/errorHandler";

class AdminService {
  constructor() {
    this.collectionName = COLLECTIONS.ADMINS;
  }

  /**
   * Check if user is admin by email
   * @param {string} email - User email
   * @returns {Promise<boolean>} True if user is admin
   */
  async checkAdmin(email) {
    try {
      if (!email) return false;

      const adminRef = doc(db, this.collectionName, email);
      const adminSnap = await getDoc(adminRef);

      return adminSnap.exists();
    } catch (error) {
      logError(error, "Ошибка проверки прав администратора", !isNetworkError(error));
      return false;
    }
  }
}

export const adminService = new AdminService();
