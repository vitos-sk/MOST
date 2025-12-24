/**
 * Main App Component
 *
 * Главный компонент приложения, который настраивает маршрутизацию и основной layout.
 * Использует React Router для навигации между экранами приложения.
 *
 * @module App
 */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";
import {
  AdminPanel,
  QuestionScreen,
  ResultScreen,
  CategoriesScreen,
} from "./components/Screens";
import { theme } from "./theme/theme";

/**
 * Контейнер приложения с темным градиентным фоном и glass-эффектом
 */
export const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: transparent;
  font-family: ${theme.typography.fontFamily};
  position: relative;
  color: ${theme.colors.text.primary};
  overflow-x: hidden;
`;

/**
 * Основной контент с ограничением ширины и отступами
 */
const MainContent = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: ${theme.spacing.md} ${theme.spacing.md};
  min-height: calc(100vh - 60px);

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }

  @media (min-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }
`;

/**
 * Обертка для страниц с анимацией появления
 */
const PageWrapper = styled.div`
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/**
 * Главный компонент приложения
 *
 * Настраивает маршрутизацию и основной layout:
 * - /admin/* - Админ-панель
 * - / - Экран категорий
 * - /questions/:categoryId - Экран вопросов по категории
 * - /results/:questionId/:categoryId - Экран результатов
 *
 * @returns {JSX.Element} Компонент приложения с маршрутизацией
 */
// Компонент для обработки параметров URL
function AppContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем параметр ?admin=true в URL для прямого доступа к админ-панели
    // Это работает, если бот запускается с параметром: t.me/your_bot?start=admin
    if (searchParams.get("admin") === "true" || searchParams.get("start") === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      const body = document.body;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Проверяем, достигли ли верха или низа страницы
      const isAtTop = scrollTop <= 10;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isAtTop || isAtBottom) {
        body.classList.add("scroll-edge");
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          body.classList.remove("scroll-edge");
        }, 1000);
      } else {
        body.classList.remove("scroll-edge");
        clearTimeout(scrollTimeout);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <AppContainer>
      <MainContent>
        <PageWrapper>
          <Routes>
            {/* Админ-панель */}
            <Route path="/admin/*" element={<AdminPanel />} />

            {/* Основной поток приложения */}
            <Route path="/" element={<CategoriesScreen />} />
            <Route path="/questions/:categoryId" element={<QuestionScreen />} />
            <Route path="/results/:questionId/:categoryId" element={<ResultScreen />} />

            {/* Редирект неизвестных маршрутов на главную */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageWrapper>
      </MainContent>
    </AppContainer>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
