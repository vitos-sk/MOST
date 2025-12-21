import { useState, useEffect } from "react";
import {
  addQuestion,
  getQuestions,
  deleteQuestion,
  getCategories,
  addCategory,
  deleteCategory,
  initializeCategories,
} from "../../services/firestoreService";
import {
  Container,
  Header,
  Title,
  TabContainer,
  TabButtons,
  TabButton,
  ContentBlock,
} from "../../styles/admin.styles";
import QuestionsTab from "./tabs/QuestionsTab";
import CategoriesTab from "./tabs/CategoriesTab";

export default function AdminPanel() {
  // ===== СОСТОЯНИЕ =====
  const [activeTab, setActiveTab] = useState("questions");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);

  // Для табы "Вопросы"
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionFormData, setQuestionFormData] = useState({
    category: "",
    text: "",
    optionA: "",
    optionB: "",
    majorityReason: "",
    minorityReason: "",
  });

  // Для табы "Категории"
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    emoji: "",
  });

  // ===== ИНИЦИАЛИЗАЦИЯ =====
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const cats = await getCategories();
      const qs = await getQuestions();
      setCategories(cats);
      setQuestions(qs);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Ошибка загрузки данных");
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
      !questionFormData.text ||
      !questionFormData.optionA ||
      !questionFormData.optionB ||
      !questionFormData.majorityReason ||
      !questionFormData.minorityReason
    ) {
      alert("Заполните все поля");
      return;
    }

    setLoading(true);
    try {
      await addQuestion(questionFormData);
      alert("✅ Вопрос добавлен");
      setQuestionFormData({
        category: "",
        text: "",
        optionA: "",
        optionB: "",
        majorityReason: "",
        minorityReason: "",
      });
      setShowQuestionForm(false);
      await loadData();
    } catch (error) {
      console.error("Error adding question:", error);
      alert("❌ Ошибка добавления вопроса");
    }
    setLoading(false);
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm("Вы уверены?")) {
      setLoading(true);
      try {
        await deleteQuestion(id);
        alert("✅ Вопрос удалён");
        await loadData();
      } catch (error) {
        console.error("Error deleting question:", error);
        alert("❌ Ошибка удаления");
      }
      setLoading(false);
    }
  };

  // ===== ОБРАБОТЧИКИ КАТЕГОРИЙ =====
  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategory = async () => {
    if (!categoryFormData.name || !categoryFormData.emoji) {
      alert("Заполните название и эмодзи");
      return;
    }

    setLoading(true);
    try {
      await addCategory(categoryFormData);
      alert("✅ Категория добавлена");
      setCategoryFormData({ name: "", emoji: "" });
      setShowCategoryForm(false);
      await loadData();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("❌ Ошибка добавления категории");
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Вы уверены?")) {
      setLoading(true);
      try {
        await deleteCategory(id);
        alert("✅ Категория удалена");
        await loadData();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("❌ Ошибка удаления");
      }
      setLoading(false);
    }
  };

  const handleInitializeCategories = async () => {
    setLoading(true);
    try {
      await initializeCategories();
      alert("✅ Категории инициализированы");
      await loadData();
    } catch (error) {
      console.error("Error initializing categories:", error);
      alert("❌ Ошибка инициализации");
    }
    setLoading(false);
  };

  // ===== РЕНДЕР =====
  return (
    <Container>
      <Header>
        <Title>🎯 Admin Panel - MOST</Title>
        <div style={{ fontSize: "14px", color: "#666" }}>
          {loading && "⏳ Загрузка..."}
        </div>
      </Header>

      <TabContainer>
        <TabButtons>
          <TabButton
            $active={activeTab === "questions"}
            onClick={() => setActiveTab("questions")}
          >
            📝 Вопросы
          </TabButton>
          <TabButton
            $active={activeTab === "categories"}
            onClick={() => setActiveTab("categories")}
          >
            📁 Категории
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
