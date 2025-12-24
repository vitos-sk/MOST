/**
 * Утилита для обработки ошибок Firebase и сетевых ошибок
 * @module utils/errorHandler
 */

/**
 * Проверяет, является ли ошибка сетевой ошибкой Firebase
 * @param {Error} error - Объект ошибки
 * @returns {boolean} true, если это сетевая ошибка
 */
export const isNetworkError = (error) => {
  if (!error) return false;

  const errorCode = error.code;
  const errorMessage = error.message?.toLowerCase() || "";

  return (
    errorCode === "unavailable" ||
    errorCode === "deadline-exceeded" ||
    errorMessage.includes("could not reach") ||
    errorMessage.includes("network") ||
    errorMessage.includes("failed to fetch") ||
    errorMessage.includes("networkerror")
  );
};

/**
 * Получает понятное сообщение об ошибке для пользователя
 * @param {Error} error - Объект ошибки
 * @returns {string} Понятное сообщение об ошибке
 */
export const getErrorMessage = (error) => {
  if (!error) return "Произошла неизвестная ошибка";

  if (isNetworkError(error)) {
    return "Проблема с подключением к интернету. Приложение работает в offline режиме.";
  }

  const errorCode = error.code;

  switch (errorCode) {
    case "permission-denied":
      return "Недостаточно прав доступа";
    case "not-found":
      return "Данные не найдены";
    case "already-exists":
      return "Данные уже существуют";
    case "resource-exhausted":
      return "Превышен лимит запросов. Попробуйте позже.";
    case "deadline-exceeded":
      return "Превышено время ожидания ответа";
    case "unauthenticated":
      return "Требуется аутентификация";
    default:
      return error.message || "Произошла ошибка при выполнении операции";
  }
};

/**
 * Логирует ошибку с соответствующим уровнем важности
 * @param {Error} error - Объект ошибки
 * @param {string} context - Контекст, в котором произошла ошибка
 * @param {boolean} isCritical - Критичность ошибки (по умолчанию false)
 */
export const logError = (error, context = "", isCritical = false) => {
  if (!error) return;

  const message = getErrorMessage(error);
  const logMessage = context ? `${context}: ${message}` : message;

  // Error logging removed for production
};
