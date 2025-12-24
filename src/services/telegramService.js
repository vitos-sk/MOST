/**
 * Инициализирует Telegram WebApp
 * Вызывает метод ready() для уведомления Telegram о готовности приложения
 * @returns {Object|null} Экземпляр Telegram.WebApp или null, если недоступен
 */
export const initTelegramApp = () => {
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    return tg;
  }
  return null;
};

/**
 * Получает данные пользователя из Telegram WebApp
 * @returns {Object|null} Объект с данными пользователя (id, firstName, lastName, username, languageCode, isPremium, photoUrl, initData) или null
 */
export const getTelegramUser = () => {
  try {
    if (typeof window === "undefined" || !window.Telegram?.WebApp) {
      return null;
    }

    const tg = window.Telegram.WebApp;
    const initData = tg.initData;
    const user = tg.initDataUnsafe?.user;

    if (!user) {
      return null;
    }

    return {
      id: user.id?.toString(),
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      languageCode: user.language_code,
      isPremium: user.is_premium || false,
      photoUrl: user.photo_url,
      initData,
    };
  } catch (error) {
    return null;
  }
};

/**
 * Получает только ID пользователя Telegram
 * @returns {string|null} ID пользователя или null, если недоступен
 */
export const getTelegramUserId = () => {
  const user = getTelegramUser();
  return user?.id || null;
};

/**
 * Проверяет, доступен ли Telegram WebApp
 * @returns {boolean} true, если Telegram WebApp доступен, иначе false
 */
export const isTelegramAvailable = () => {
  return typeof window !== "undefined" && !!window.Telegram?.WebApp;
};

/**
 * Создает mock-пользователя для разработки (когда приложение запущено вне Telegram)
 * @returns {Object} Объект mock-пользователя с полем isMock: true
 */
export const getMockUser = () => {
  return {
    id: "mock-user-" + Math.random().toString(36).substr(2, 9),
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    languageCode: "ru",
    isPremium: false,
    photoUrl: null,
    initData: "mock-init-data",
    isMock: true,
  };
};

/**
 * Получает пользователя (реального из Telegram или mock для разработки)
 * Приоритет: реальный пользователь Telegram > mock пользователь
 * @returns {Object} Объект пользователя (всегда возвращает значение)
 */
export const getUser = () => {
  // Сначала проверяем, доступен ли Telegram
  const telegramAvailable = isTelegramAvailable();

  if (telegramAvailable) {
    // Если Telegram доступен, пытаемся получить реального пользователя
    const telegramUser = getTelegramUser();
    if (telegramUser) {
      return telegramUser;
    }
  }

  // Если Telegram недоступен или данные не получены - используем mock
  return getMockUser();
};

/**
 * Закрывает Telegram Mini App
 */
export const closeTelegramApp = () => {
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    window.Telegram.WebApp.close();
  }
};

/**
 * Показывает alert через Telegram API или нативный alert
 * @param {string} message - Текст сообщения
 */
export const showTelegramAlert = (message) => {
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    window.Telegram.WebApp.showAlert(message);
  } else {
    alert(message);
  }
};

/**
 * Показывает подтверждение через Telegram API или нативный confirm
 * @param {string} message - Текст сообщения для подтверждения
 * @returns {Promise<boolean>} Promise, который разрешается с true/false в зависимости от выбора пользователя
 */
export const showTelegramConfirm = (message) => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.showConfirm(message, (confirmed) => {
        resolve(confirmed);
      });
    } else {
      resolve(confirm(message));
    }
  });
};
