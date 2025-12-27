/**
 * Categories Service
 * Handles all category-related operations
 */

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firestoreCollections";
import { BaseService } from "./baseService";

class CategoriesService extends BaseService {
  constructor() {
    super(COLLECTIONS.CATEGORIES);
  }

  /**
   * Create a new category
   * @param {Object} categoryData - Category data (name, emoji)
   * @returns {Promise<string>} Category ID
   */
  async create(categoryData) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...categoryData,
        createdAt: serverTimestamp(),
        questionsCount: 0,
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get category name by ID
   * @param {string} categoryId - Category ID
   * @returns {Promise<string|null>} Category name or null
   */
  async getNameById(categoryId) {
    try {
      const category = await this.getById(categoryId);
      return category?.name || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get subcategories (currently returns all categories, can be extended)
   * @param {string} parentId - Parent category ID (optional)
   * @returns {Promise<Array>} Array of categories
   */
  async getSubcategories(parentId) {
    // For now, return all categories. Can be extended for hierarchical structure
    return this.getAll();
  }
}

export const categoriesService = new CategoriesService();
