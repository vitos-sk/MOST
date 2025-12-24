/**
 * API для работы с категориями
 * @module API/categories/getCategoryName
 */

/**
 * Получает имя категории
 * @param {string} categoryId - ID категории
 * @param {Array<Object>} categories - Массив категорий для поиска
 * @returns {string} Имя категории или categoryId, если категория не найдена
 */
export const getCategoryName = (categoryId, categories) => {
  const cat = categories.find((c) => c.id === categoryId);
  return cat ? cat.name : categoryId;
};
