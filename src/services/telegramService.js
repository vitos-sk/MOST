// Telegram Mini App Service
// Работает с Telegram WebApp API для автоматической авторизации

export const initTelegramApp = () => {
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    return tg;
  }
  return null;
};

export const getTelegramUser = () => {
  try {
    if (typeof window === "undefined" || !window.Telegram?.WebApp) {
      console.warn("Telegram WebApp не доступен");
      return null;
    }

    const tg = window.Telegram.WebApp;
    const initData = tg.initData;
    const user = tg.initDataUnsafe?.user;

    if (!user) {
      console.warn("Данные пользователя Telegram не найдены");
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
    console.error("Ошибка получения данных пользователя Telegram:", error);
    return null;
  }
};

export const getTelegramUserId = () => {
  const user = getTelegramUser();
  return user?.id || null;
};

export const isTelegramAvailable = () => {
  return typeof window !== "undefined" && !!window.Telegram?.WebApp;
};

// Mock User для разработки (когда не в Telegram)
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

// Получить пользователя (реальный или mock)
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
  console.log("ℹ️ Используется Mock User для разработки");
  return getMockUser();
};

export const closeTelegramApp = () => {
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    window.Telegram.WebApp.close();
  }
};

export const showTelegramAlert = (message) => {
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    window.Telegram.WebApp.showAlert(message);
  } else {
    alert(message);
  }
};

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
