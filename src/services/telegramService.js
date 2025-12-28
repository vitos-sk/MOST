import WebApp from "@twa-dev/sdk";

/**
 * Инициализирует Telegram WebApp
 * Вызывает метод ready() для уведомления Telegram о готовности приложения
 * @returns {Object|null} Экземпляр WebApp или null, если недоступен
 */
export const initTelegramApp = () => {
  try {
    // Проверяем наличие initData - это основной признак того, что мы в Telegram
    if (typeof window !== "undefined" && WebApp.initData) {
      WebApp.ready();
      // Настраиваем параметры интерфейса
      WebApp.expand();
      return WebApp;
    }
    return null;
  } catch (error) {
    console.warn("Telegram WebApp не доступен:", error);
    return null;
  }
};

/**
 * Получает данные пользователя из Telegram WebApp
 * @returns {Object|null} Объект с данными пользователя (id, firstName, lastName, username, languageCode, isPremium, photoUrl, initData) или null
 */
export const getTelegramUser = () => {
  try {
    // Проверяем наличие initData - основной признак того, что мы в Telegram Mini App
    if (typeof window === "undefined" || !WebApp.initData) {
      return null;
    }

    const user = WebApp.initDataUnsafe?.user;

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
      initData: WebApp.initData,
    };
  } catch (error) {
    console.warn("Ошибка при получении данных пользователя Telegram:", error);
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
  try {
    // Проверяем наличие window.Telegram.WebApp и initData
    // Оба должны быть доступны для работы в Telegram Mini App
    return (
      typeof window !== "undefined" && !!window.Telegram?.WebApp && !!WebApp.initData
    );
  } catch (error) {
    return false;
  }
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
      console.log("✅ Получен реальный пользователь Telegram:", telegramUser.id);
      return telegramUser;
    } else {
      console.warn("⚠️ Telegram доступен, но данные пользователя не получены");
    }
  } else {
    console.warn("⚠️ Telegram WebApp недоступен, используется mock пользователь");
  }

  // Если Telegram недоступен или данные не получены - используем mock
  const mockUser = getMockUser();
  console.warn("⚠️ Используется mock пользователь:", mockUser.id);
  return mockUser;
};

/**
 * Закрывает Telegram Mini App
 */
export const closeTelegramApp = () => {
  try {
    if (typeof window !== "undefined" && WebApp.initData) {
      WebApp.close();
    }
  } catch (error) {
    console.warn("Не удалось закрыть приложение:", error);
  }
};

/**
 * Показывает alert через Telegram API или нативный alert
 * @param {string} message - Текст сообщения
 */
export const showTelegramAlert = (message) => {
  try {
    if (typeof window !== "undefined" && WebApp.initData) {
      WebApp.showAlert(message);
    } else {
      alert(message);
    }
  } catch (error) {
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
    try {
      if (typeof window !== "undefined" && WebApp.initData) {
        WebApp.showConfirm(message, (confirmed) => {
          resolve(confirmed);
        });
      } else {
        resolve(confirm(message));
      }
    } catch (error) {
      resolve(confirm(message));
    }
  });
};
