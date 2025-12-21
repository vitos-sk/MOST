import { createContext, useContext, useEffect, useState } from "react";
import { getUser, initTelegramApp } from "../services/telegramService";
import { addUser, getUser as getUserFromDB } from "../services/firestoreService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Инициализировать Telegram приложение
      initTelegramApp();

      // Получить пользователя (из Telegram или mock) - ВСЕГДА вернет значение
      const telegramUser = getUser();

      if (telegramUser) {
        // Сохранить в state
        setUser(telegramUser);
        setIsAuthenticated(true);

        // Добавить в Firebase, если нового пользователя (только если не mock)
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

              console.log("✅ Новый пользователь добавлен в Firebase");
            } else {
              console.log("✅ Пользователь уже зарегистрирован");
            }
          } catch (dbError) {
            // Firebase ошибка не критична для аутентификации
            console.warn("Ошибка при работе с Firebase:", dbError);
          }
        } else {
          console.log("ℹ️ Mock пользователь - Firebase операции пропущены");
        }
      } else {
        // Если даже mock не получился - это критическая ошибка
        throw new Error("Не удалось получить данные пользователя");
      }
    } catch (error) {
      console.error("Ошибка инициализации аутентификации:", error);
      // Создаем fallback mock пользователя при критической ошибке
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

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
