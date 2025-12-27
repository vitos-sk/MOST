import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { categoriesService, questionsService, adminService } from "../../../services/api";
import { CategoriesTab, QuestionsTab } from "./tabs";
import { AdminLogin } from "./AdminLogin";
import { theme } from "../../../theme/theme";
import { useModal } from "../../../context/ModalContext";
import { ROUTES } from "../../../config/routes";
import {
  AdminHeader,
  AdminTabs,
  AccessDenied,
  AdminBackButton,
  LoadingState,
} from "./components";

export function AdminPanel() {
  const navigate = useNavigate();
  const { showError, showSuccess, showConfirm } = useModal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("questions");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionFormData, setQuestionFormData] = useState({
    category: "",
    code: "",
    optionA: "",
    optionB: "",
    optionC: "",
    correctAnswer: "",
  });

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    emoji: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setQuestions([]);
      setCategories([]);

      if (user && user.email) {
        try {
          const adminStatus = await adminService.checkAdmin(user.email);
          setIsAdmin(adminStatus);
          setIsAuthenticated(true);

          if (adminStatus) {
            loadData();
          } else {
            console.log("User is not admin:", user.email);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAuthenticated(true);
          setIsAdmin(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const cats = await categoriesService.getAll();
      const qs = await questionsService.getAll();
      setCategories(cats);
      setQuestions(qs);
    } catch (error) {
      showError("Ошибка загрузки данных");
    }
    setLoading(false);
  };

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
      await questionsService.create(questionFormData);
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
      await questionsService.delete(id);
      showSuccess("Вопрос удалён");
      await loadData();
    } catch (error) {
      showError("Ошибка удаления");
    }
    setLoading(false);
  };

  const handleCategoryInputChange = (e) => {
    if (!e) return;

    const target = e.target || e.currentTarget;
    if (!target) return;

    const { name, value } = target;
    if (!name) return;

    const newValue = value !== undefined && value !== null ? String(value) : "";

    setCategoryFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleAddCategory = async () => {
    const name = categoryFormData.name?.trim();
    const emoji = categoryFormData.emoji?.trim();

    if (!name || !emoji) {
      showError("Заполните название и эмодзи");
      return;
    }

    setLoading(true);
    try {
      await categoriesService.create({ name, emoji });
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
      await categoriesService.delete(id);
      showSuccess("Категория удалена");
      await loadData();
    } catch (error) {
      showError("Ошибка удаления");
    }
    setLoading(false);
  };

  if (authLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => {}} />;
  }

  if (!isAdmin) {
    return (
      <>
        <AccessDenied onLogout={handleLogout} />
        <AdminBackButton onClick={() => navigate(ROUTES.HOME)} />
      </>
    );
  }

  return (
    <Container>
      <AdminHeader onLogout={handleLogout} />
      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab}>
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
          />
        )}
      </AdminTabs>
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
