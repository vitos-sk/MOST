import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import {
  getCategories,
  addCategory,
  deleteCategory,
  addQuestion,
  getQuestions,
  deleteQuestion,
  checkAdmin,
} from "../../../API";
import { CategoriesTab, QuestionsTab } from "./tabs";
import { AdminLogin } from "./AdminLogin";
import { theme, cardGlass } from "../../../theme/theme";
import { useModal } from "../../../context/ModalContext";

export function AdminPanel() {
  const navigate = useNavigate();
  const { showError, showSuccess, showConfirm } = useModal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  // ===== СОСТОЯНИЕ =====
  const [activeTab, setActiveTab] = useState("questions");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all"); // Фильтр по категориям

  // Для табы "Вопросы"
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionFormData, setQuestionFormData] = useState({
    category: "",
    code: "",
    optionA: "",
    optionB: "",
    optionC: "",
    correctAnswer: "",
  });

  // Для табы "Категории"
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    emoji: "",
  });

  // ===== АВТОРИЗАЦИЯ =====
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Проверяем, является ли пользователь администратором
        const adminStatus = await checkAdmin(user.email);
        setIsAdmin(adminStatus);
        setIsAuthenticated(true);
        if (adminStatus) {
          loadData();
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      showError("Ошибка выхода");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const cats = await getCategories();
      const qs = await getQuestions();
      setCategories(cats);
      setQuestions(qs);
    } catch (error) {
      showError("Ошибка загрузки данных");
    }
    setLoading(false);
  };

  // ===== ОБРАБОТЧИКИ ВОПРОСОВ =====
  const handleQuestionInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddQuestion = async () => {
    if (
      !questionFormData.category ||
      !questionFormData.code ||
      !questionFormData.optionA ||
      !questionFormData.optionB ||
      !questionFormData.optionC ||
      !questionFormData.correctAnswer
    ) {
      showError("Заполните все поля");
      return;
    }

    setLoading(true);
    try {
      await addQuestion(questionFormData);
      showSuccess("Вопрос добавлен");
      const addedCategoryId = questionFormData.category;
      setQuestionFormData({
        category: "",
        code: "",
        optionA: "",
        optionB: "",
        optionC: "",
        correctAnswer: "",
      });
      setShowQuestionForm(false);
      await loadData();
      // Устанавливаем фильтр на категорию добавленного вопроса
      setSelectedCategory(addedCategoryId);
    } catch (error) {
      showError("Ошибка добавления вопроса");
    }
    setLoading(false);
  };

  const handleDeleteQuestion = async (id) => {
    const confirmed = await showConfirm("Вы уверены, что хотите удалить этот вопрос?");
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteQuestion(id);
      showSuccess("Вопрос удалён");
      await loadData();
    } catch (error) {
      showError("Ошибка удаления");
    }
    setLoading(false);
  };

  // ===== ОБРАБОТЧИКИ КАТЕГОРИЙ =====
  const handleCategoryInputChange = (e) => {
    if (!e) return;

    // Поддерживаем как нативные события, так и синтетические от IconPicker
    const target = e.target || e.currentTarget;
    if (!target) return;

    const { name, value } = target;
    if (!name) return;

    // Обновляем состояние
    // Важно: сохраняем значение как есть, даже если это пустая строка
    // Не используем value || "", так как это может потерять значение "0" или другие falsy значения
    const newValue = value !== undefined && value !== null ? String(value) : "";

    setCategoryFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleAddCategory = async () => {
    // Проверяем наличие обязательных полей
    const name = categoryFormData.name?.trim();
    const emoji = categoryFormData.emoji?.trim();

    if (!name || !emoji) {
      showError("Заполните название и эмодзи");
      return;
    }

    setLoading(true);
    try {
      await addCategory({ name, emoji });
      showSuccess("Категория добавлена");
      setCategoryFormData({ name: "", emoji: "" });
      setShowCategoryForm(false);
      await loadData();
    } catch (error) {
      showError("Ошибка добавления категории");
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (id) => {
    const confirmed = await showConfirm("Вы уверены, что хотите удалить эту категорию?");
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteCategory(id);
      showSuccess("Категория удалена");
      await loadData();
    } catch (error) {
      showError("Ошибка удаления");
    }
    setLoading(false);
  };

  const handleInitializeCategories = async () => {
    const confirmed = await showConfirm(
      "Это создаст категории: Функции, Асинхронные функции, Циклы, Стрелочные функции. Продолжить?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      // Создаем категории
      const functionsId = await addCategory({
        name: "Функции",
        emoji: "code",
      });

      const asyncFunctionsId = await addCategory({
        name: "Асинхронные функции",
        emoji: "code",
      });

      const loopsId = await addCategory({
        name: "Циклы",
        emoji: "code",
      });

      const arrowFunctionsId = await addCategory({
        name: "Стрелочные функции",
        emoji: "code",
      });

      // Добавляем тестовые вопросы в категорию "Асинхронные функции"
      const testQuestions = [
        {
          category: asyncFunctionsId,
          code: `let x = 1;
let y = x++;
console.log(x, y);`,
          optionA: "1, 1",
          optionB: "2, 1",
          optionC: "1, 2",
          correctAnswer: "B",
        },
        {
          category: asyncFunctionsId,
          code: `const arr = [1, 2, 3];
arr.push(4);
console.log(arr.length);`,
          optionA: "3",
          optionB: "4",
          optionC: "undefined",
          correctAnswer: "B",
        },
      ];

      for (const question of testQuestions) {
        await addQuestion(question);
      }

      showSuccess("Категории созданы!");
      await loadData();
    } catch (error) {
      showError("Ошибка инициализации категорий");
    }
    setLoading(false);
  };

  // ===== РЕНДЕР =====
  if (authLoading) {
    return (
      <Container>
        <LoadingText>Загрузка...</LoadingText>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  if (!isAdmin) {
    return (
      <Container>
        <AccessDenied>
          <AccessDeniedTitle>🚫 Доступ запрещён</AccessDeniedTitle>
          <AccessDeniedText>
            У вас нет прав доступа к админ-панели. Обратитесь к администратору.
          </AccessDeniedText>
          <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
        </AccessDenied>
        <FixedBackButton onClick={() => navigate("/")} aria-label="На главную">
          <BackIcon>‹</BackIcon>
        </FixedBackButton>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Админ-панель</HeaderTitle>
        <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
      </Header>
      <TabContainer>
        <TabButtons>
          <TabButton
            $active={activeTab === "questions"}
            onClick={() => setActiveTab("questions")}
          >
            Вопросы
          </TabButton>
          <TabButton
            $active={activeTab === "categories"}
            onClick={() => setActiveTab("categories")}
          >
            Категории
          </TabButton>
        </TabButtons>

        <ContentBlock>
          {activeTab === "questions" && (
            <QuestionsTab
              questions={questions}
              categories={categories}
              loading={loading}
              showForm={showQuestionForm}
              formData={questionFormData}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onFormToggle={() => setShowQuestionForm(!showQuestionForm)}
              onInputChange={handleQuestionInputChange}
              onSubmit={handleAddQuestion}
              onDelete={handleDeleteQuestion}
            />
          )}

          {activeTab === "categories" && (
            <CategoriesTab
              categories={categories}
              loading={loading}
              showForm={showCategoryForm}
              formData={categoryFormData}
              onFormToggle={() => setShowCategoryForm(!showCategoryForm)}
              onInputChange={handleCategoryInputChange}
              onSubmit={handleAddCategory}
              onDelete={handleDeleteCategory}
              onInitialize={handleInitializeCategories}
            />
          )}
        </ContentBlock>
      </TabContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: ${theme.spacing.md};
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
  }
`;

const Header = styled.div`
  ${cardGlass}
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: 0;
  border: 1px solid ${theme.colors.border.default};
  box-shadow: none;
  background: ${theme.colors.bg.card};

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${theme.spacing.md};
    align-items: stretch;
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: ${theme.typography.sizes.xl};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.weights.bold};

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes["2xl"]};
  }
`;

const LogoutButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.status.error};
  color: ${theme.colors.text.primary};
  border: none;
  border-radius: 0;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.semibold};
  font-family: ${theme.typography.fontFamily};
  transition: all ${theme.transition.base};
  min-height: 40px;

  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
    box-shadow: none;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.weights.medium};
`;

const AccessDenied = styled.div`
  ${cardGlass}
  border-radius: 0;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  text-align: center;
  box-shadow: none;
  border: 1px solid ${theme.colors.border.default};
  max-width: 500px;
  margin: 0 auto;
  background: ${theme.colors.bg.card};
`;

const AccessDeniedTitle = styled.h2`
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: ${theme.typography.sizes.xl};
  color: ${theme.colors.status.error};
  font-weight: ${theme.typography.weights.bold};

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes["2xl"]};
  }
`;

const AccessDeniedText = styled.p`
  margin: 0 0 ${theme.spacing.xl} 0;
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeights.relaxed};
`;

const TabContainer = styled.div`
  ${cardGlass}
  border-radius: 0;
  padding: ${theme.spacing.lg};
  position: relative;
  z-index: 1;
  box-shadow: none;
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.bg.card};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
  }
`;

const TabButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xl};
  border-bottom: 2px solid ${theme.colors.border.default};
  padding-bottom: ${theme.spacing.xs};
`;

const TabButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border: none;
  background: transparent;
  color: ${(props) =>
    props.$active ? theme.colors.accent.primary : theme.colors.text.tertiary};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${(props) =>
    props.$active ? theme.typography.weights.bold : theme.typography.weights.normal};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  border-bottom: 3px solid
    ${(props) => (props.$active ? theme.colors.accent.primary : "transparent")};
  transition: all ${theme.transition.base};
  margin-bottom: -2px;
  position: relative;

  &:hover {
    color: ${theme.colors.accent.primary};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    &:active {
      transform: none;
    }
  }
`;

const ContentBlock = styled.div`
  margin-top: ${theme.spacing.md};
`;

const FixedBackButton = styled.button`
  ${cardGlass}
  position: fixed;
  bottom: ${theme.spacing.md};
  left: ${theme.spacing.md};
  width: 56px;
  height: 56px;
  border-radius: 0;
  border: 1px solid ${theme.colors.border.default};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition: all ${theme.transition.base};
  padding: 0;
  background: ${theme.colors.bg.glass};
  z-index: ${theme.zIndex.sticky};
  box-shadow: none;

  /* Для мобильных: активное состояние вместо hover */
  &:active {
    transform: scale(0.95);
    background: ${theme.colors.bg.cardHover};
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 52px;
    height: 52px;
    bottom: ${theme.spacing.lg};
    left: ${theme.spacing.lg};

    &:hover {
      background: ${theme.colors.bg.cardHover};
      border-color: ${theme.colors.border.accent};
      transform: translateX(-2px);
      box-shadow: none;
    }

    &:active {
      transform: translateX(-1px);
    }
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent.primary};
    outline-offset: 2px;
  }
`;

const BackIcon = styled.span`
  font-size: ${theme.typography.sizes["2xl"]};
  color: ${theme.colors.text.primary};
  line-height: 1;
  font-weight: ${theme.typography.weights.bold};
`;
