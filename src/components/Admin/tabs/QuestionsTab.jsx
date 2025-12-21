import { Fragment } from "react";
import { StatsInfo, Button, ItemsList, EmptyState } from "../../../styles/admin.styles";
import QuestionForm from "../forms/QuestionForm";
import QuestionCard from "../cards/QuestionCard";

export default function QuestionsTab({
  questions,
  categories,
  loading,
  showForm,
  formData,
  onFormToggle,
  onInputChange,
  onSubmit,
  onDelete,
}) {
  return (
    <Fragment>
      <StatsInfo>
        <p>
          📊 Всего вопросов: <strong>{questions.length}</strong>
        </p>
      </StatsInfo>

      <Button onClick={onFormToggle} disabled={loading}>
        {showForm ? "Скрыть форму" : "➕ Добавить вопрос"}
      </Button>

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
        {questions.length === 0 ? (
          <EmptyState>Вопросов нет. Добавьте первый!</EmptyState>
        ) : (
          questions.map((q) => (
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
