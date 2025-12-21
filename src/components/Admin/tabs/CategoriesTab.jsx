import { Fragment } from "react";
import { StatsInfo, Button, ItemsList, EmptyState } from "../../../styles/admin.styles";
import CategoryForm from "../forms/CategoryForm";
import CategoryCard from "../cards/CategoryCard";

export default function CategoriesTab({
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
          📁 Всего категорий: <strong>{categories.length}</strong>
        </p>
      </StatsInfo>

      <Button onClick={onFormToggle} disabled={loading}>
        {showForm ? "Скрыть форму" : "➕ Новая категория"}
      </Button>

      {categories.length === 0 && (
        <Button
          onClick={onInitialize}
          disabled={loading}
          style={{ marginLeft: "10px", backgroundColor: "#4CAF50" }}
        >
          🔄 Инициализировать категории
        </Button>
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
