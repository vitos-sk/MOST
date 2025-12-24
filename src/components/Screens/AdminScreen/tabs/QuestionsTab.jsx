import { Fragment, useMemo } from "react";
import styled from "styled-components";
import { QuestionForm } from "../forms/QuestionForm";
import { QuestionCard } from "../cards/QuestionCard";
import { Button } from "../../../UI-components";
import { theme, cardGlass } from "../../../../theme/theme";

export function QuestionsTab({
  questions,
  categories,
  loading,
  showForm,
  formData,
  selectedCategory,
  onCategoryChange,
  onFormToggle,
  onInputChange,
  onSubmit,
  onDelete,
}) {
  // Фильтруем вопросы по выбранной категории
  const filteredQuestions = useMemo(() => {
    if (selectedCategory === "all") {
      return questions;
    }
    return questions.filter((q) => q.category === selectedCategory);
  }, [questions, selectedCategory]);

  // Получаем название категории
  const getCategoryName = (categoryId) => {
    if (categoryId === "all") return "Все категории";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Неизвестная категория";
  };

  return (
    <Fragment>
      <StatsInfo>
        <p>
          Всего вопросов: <strong>{questions.length}</strong>
          {selectedCategory !== "all" && (
            <>
              {" "}
              | В категории "{getCategoryName(selectedCategory)}":{" "}
              <strong>{filteredQuestions.length}</strong>
            </>
          )}
        </p>
      </StatsInfo>

      <FilterSection>
        <FilterLabel>Фильтр по категории:</FilterLabel>
        <CategorySelect
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">Все категории</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </CategorySelect>
      </FilterSection>

      <ButtonWrapper>
        <Button variant="primary" onClick={onFormToggle} disabled={loading}>
          {showForm ? "Скрыть форму" : "Добавить вопрос"}
        </Button>
      </ButtonWrapper>

      {showForm && (
        <QuestionForm
          formData={formData}
          categories={categories}
          loading={loading}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
        />
      )}

      <ItemsList>
        {filteredQuestions.length === 0 ? (
          <EmptyState>
            {selectedCategory === "all"
              ? "Вопросов нет. Добавьте первый!"
              : `В категории "${getCategoryName(selectedCategory)}" нет вопросов.`}
          </EmptyState>
        ) : (
          filteredQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              categories={categories}
              onDelete={onDelete}
              loading={loading}
            />
          ))
        )}
      </ItemsList>
    </Fragment>
  );
}

const StatsInfo = styled.div`
  ${cardGlass}
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  margin-bottom: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.accent.gradientSoft};

  p {
    margin: 0;
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.sizes.base};
    font-weight: ${theme.typography.weights.medium};

    strong {
      font-weight: ${theme.typography.weights.bold};
      color: ${theme.colors.accent.primary};
    }
  }
`;

const ButtonWrapper = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const FilterSection = styled.div`
  ${cardGlass}
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.bg.card};
  flex-wrap: wrap;
`;

const FilterLabel = styled.label`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.secondary};
  white-space: nowrap;
`;

const CategorySelect = styled.select`
  flex: 1;
  min-width: 200px;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.radius.md};
  font-size: ${theme.typography.sizes.base};
  background: ${theme.colors.bg.card};
  color: ${theme.colors.text.primary};
  font-family: ${theme.typography.fontFamily};
  cursor: pointer;
  touch-action: manipulation;
  transition: all ${theme.transition.base};

  &:hover {
    border-color: ${theme.colors.border.accent};
    background: ${theme.colors.bg.cardHover};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.primary};
    box-shadow: 0 0 0 3px ${theme.colors.accent.primary}20;
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xl};
`;

const EmptyState = styled.div`
  ${cardGlass}
  text-align: center;
  padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  color: ${theme.colors.text.tertiary};
  font-size: ${theme.typography.sizes.base};
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.bg.card};
`;
