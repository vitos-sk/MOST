/**
 * Authentication Context Module
 *
 * Предоставляет контекст аутентификации для всего приложения.
 * Управляет состоянием пользователя, инициализацией Telegram и синхронизацией с Firebase.
 *
 * @module context/AuthContext
 */

import { createContext, useContext, useEffect, useState } from "react";
import { getUser, initTelegramApp } from "../services/telegramService";
import { addUser, getUser as getUserFromDB } from "../API";

/**
 * Контекст аутентификации
 * @type {React.Context}
 */
const AuthContext = createContext();

/**
 * Провайдер контекста аутентификации
 *
 * Инициализирует аутентификацию пользователя через Telegram WebApp,
 * синхронизирует данные с Firebase и предоставляет состояние аутентификации дочерним компонентам.
 *
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние компоненты
 * @returns {JSX.Element} Провайдер контекста
 */
export const AuthProvider = ({ children }) => {
  // Состояние пользователя
  const [user, setUser] = useState(null);
  // Состояние загрузки (инициализация аутентификации)
  const [loading, setLoading] = useState(true);
  // Флаг аутентификации
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Инициализация аутентификации при монтировании компонента
  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Инициализирует аутентификацию пользователя
   *
   * Процесс:
   * 1. Инициализирует Telegram WebApp
   * 2. Получает данные пользователя (из Telegram или mock)
   * 3. Синхронизирует с Firebase (если не mock пользователь)
   * 4. Устанавливает состояние аутентификации
   *
   * @async
   * @function initializeAuth
   */
  const initializeAuth = async () => {
    try {
      // 1. Инициализировать Telegram приложение
      initTelegramApp();

      // 2. Получить пользователя (из Telegram или mock) - ВСЕГДА вернет значение
      const telegramUser = getUser();

      if (telegramUser) {
        // 3. Сохранить в state
        setUser(telegramUser);
        setIsAuthenticated(true);

        // 4. Синхронизация с Firebase (только для реальных пользователей, не mock)
        if (!telegramUser.isMock) {
          try {
            const existingUser = await getUserFromDB(telegramUser.id);

            if (!existingUser) {
              // Новый пользователь - добавляем в БД
              await addUser({
                telegramId: telegramUser.id,
                firstName: telegramUser.firstName,
                lastName: telegramUser.lastName,
                username: telegramUser.username,
                languageCode: telegramUser.languageCode,
                isPremium: telegramUser.isPremium,
                photoUrl: telegramUser.photoUrl,
              });
            }
          } catch (dbError) {
            // Firebase ошибка не критична для аутентификации
            // Приложение продолжит работать с локальными данными пользователя
          }
        }
      } else {
        // Если даже mock не получился - это критическая ошибка
        throw new Error("Не удалось получить данные пользователя");
      }
    } catch (error) {
      // Создаем fallback mock пользователя при критической ошибке
      // Это позволяет приложению продолжить работу даже при сбоях
      const fallbackUser = {
        id: "fallback-" + Math.random().toString(36).substr(2, 9),
        firstName: "User",
        lastName: "Fallback",
        isMock: true,
      };
      setUser(fallbackUser);
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Выход пользователя из системы
   * Очищает состояние пользователя и устанавливает isAuthenticated в false
   *
   * @function logout
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Значение контекста, передаваемое дочерним компонентам
  const contextValue = {
    user, // Текущий пользователь (null, если не авторизован)
    loading, // Флаг загрузки (true во время инициализации)
    isAuthenticated, // Флаг аутентификации (true, если пользователь авторизован)
    logout, // Функция для выхода
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/**
 * Хук для доступа к контексту аутентификации
 *
 * @returns {Object} Объект с полями: { user, loading, isAuthenticated, logout }
 * @throws {Error} Если хук используется вне AuthProvider
 *
 * @example
 * const { user, loading, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
