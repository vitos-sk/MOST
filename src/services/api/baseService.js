/**
 * Base Service for Firestore operations
 * Provides common CRUD operations and error handling
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { logError, isNetworkError } from "../../utils/errorHandler";
import { COLLECTIONS } from "../../constants/firestoreCollections";

/**
 * Base service class for Firestore operations
 */
export class BaseService {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collectionRef = collection(db, collectionName);
  }

  /**
   * Get all documents from collection
   * @returns {Promise<Array>} Array of documents with id
   */
  async getAll() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      logError(error, `Ошибка получения ${this.collectionName}`, !isNetworkError(error));
      throw error;
    }
  }

  /**
   * Get document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Object|null>} Document data with id or null
   */
  async getById(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      }
      return null;
    } catch (error) {
      logError(error, `Ошибка получения ${this.collectionName}`, !isNetworkError(error));
      throw error;
    }
  }

  /**
   * Create new document
   * @param {Object} data - Document data
   * @returns {Promise<string>} Created document ID
   */
  async create(data) {
    try {
      const docRef = await addDoc(this.collectionRef, {
        ...data,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      logError(error, `Ошибка создания ${this.collectionName}`, !isNetworkError(error));
      throw error;
    }
  }

  /**
   * Update document by ID
   * @param {string} id - Document ID
   * @param {Object} data - Data to update
   * @returns {Promise<void>}
   */
  async update(id, data) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      logError(error, `Ошибка обновления ${this.collectionName}`, !isNetworkError(error));
      throw error;
    }
  }

  /**
   * Delete document by ID
   * @param {string} id - Document ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      logError(error, `Ошибка удаления ${this.collectionName}`, !isNetworkError(error));
      throw error;
    }
  }

  /**
   * Query documents by field
   * @param {string} field - Field name
   * @param {string} operator - Comparison operator
   * @param {*} value - Value to compare
   * @returns {Promise<Array>} Array of matching documents
   */
  async queryByField(field, operator, value) {
    try {
      const q = query(this.collectionRef, where(field, operator, value));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      logError(error, `Ошибка запроса ${this.collectionName}`, !isNetworkError(error));
      throw error;
    }
  }
}
