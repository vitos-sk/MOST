/**
 * Application Routes Configuration
 */

export const ROUTES = {
  HOME: "/",
  QUESTIONS: "/questions/:categoryId",
  RESULTS: "/results/:questionId/:categoryId",
  ADMIN: "/admin",
  ADMIN_WILDCARD: "/admin/*",
};

/**
 * Route helper functions
 */
export const routeHelpers = {
  /**
   * Generate questions route with category ID
   * @param {string} categoryId - Category ID
   * @returns {string} Route path
   */
  questions: (categoryId) => `/questions/${categoryId}`,

  /**
   * Generate results route with question and category IDs
   * @param {string} questionId - Question ID
   * @param {string} categoryId - Category ID
   * @returns {string} Route path
   */
  results: (questionId, categoryId) => `/results/${questionId}/${categoryId}`,
};
