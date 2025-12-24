import { Fragment } from "react";
import styled from "styled-components";
import { CategoryForm } from "../forms/CategoryForm";
import { CategoryCard } from "../cards/CategoryCard";
import { Button } from "../../../UI-components";
import { theme, cardGlass } from "../../../../theme/theme";

export function CategoriesTab({
  categories,
  loading,
  showForm,
  formData,
  onFormToggle,
  onInputChange,
  onSubmit,
  onDelete,
  onInitialize,
}) {
  return (
    <Fragment>
      <StatsInfo>
        <p>
          Всего категорий: <strong>{categories.length}</strong>
        </p>
      </StatsInfo>

      <Button onClick={onFormToggle} disabled={loading}>
        {showForm ? "Скрыть форму" : "Новая категория"}
      </Button>

      {categories.length === 0 && (
        <InitButton onClick={onInitialize} disabled={loading}>
          Инициализировать категории
        </InitButton>
      )}

      {showForm && (
        <CategoryForm
          formData={formData}
          loading={loading}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
        />
      )}

      <ItemsList>
        {categories.length === 0 ? (
          <EmptyState>Категорий нет. Инициализируйте или добавьте первую!</EmptyState>
        ) : (
          categories.map((c) => (
            <CategoryCard key={c.id} category={c} onDelete={onDelete} loading={loading} />
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

const InitButton = styled(Button)`
  margin-left: ${theme.spacing.sm};
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xl};
  position: relative;
  z-index: 1;
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
