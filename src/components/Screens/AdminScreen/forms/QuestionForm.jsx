import styled from "styled-components";
import { validateQuestionForm } from "../utils/adminUtils";
import { Input, Textarea, Select, Button } from "../../../UI-components";
import { theme, cardGlass } from "../../../../theme/theme";
import { useModal } from "../../../../context/ModalContext";

const Form = styled.form`
  ${cardGlass}
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  border-radius: 0;
  margin-bottom: ${theme.spacing.xl};
  box-shadow: none;
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.bg.card};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

export function QuestionForm({ formData, categories, loading, onInputChange, onSubmit }) {
  const { showError } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateQuestionForm(formData);
    if (!validation.valid) {
      showError(validation.error);
      return;
    }
    onSubmit();
  };

  // Преобразуем категории в формат для Select
  const categoryOptions = [
    { value: "", label: "Выберите категорию" },
    ...categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
      emoji: cat.emoji,
    })),
  ];

  return (
    <Form onSubmit={handleSubmit}>
      <Select
        label="Категория *"
        name="category"
        value={formData.category}
        onChange={onInputChange}
        options={categoryOptions}
        required
      />

      <Textarea
        label="Код JavaScript (задача) *"
        name="code"
        value={formData.code}
        onChange={onInputChange}
        placeholder="Введите код JavaScript для задачи"
        minHeight="150px"
        required
      />

      <Input
        label="Вариант ответа A *"
        type="text"
        name="optionA"
        value={formData.optionA}
        onChange={onInputChange}
        placeholder="Первый вариант ответа"
        required
      />

      <Input
        label="Вариант ответа B *"
        type="text"
        name="optionB"
        value={formData.optionB}
        onChange={onInputChange}
        placeholder="Второй вариант ответа"
        required
      />

      <Input
        label="Вариант ответа C *"
        type="text"
        name="optionC"
        value={formData.optionC}
        onChange={onInputChange}
        placeholder="Третий вариант ответа"
        required
      />

      <Select
        label="Правильный ответ *"
        name="correctAnswer"
        value={formData.correctAnswer}
        onChange={onInputChange}
        options={[
          { value: "", label: "Выберите правильный ответ" },
          { value: "A", label: "Вариант A" },
          { value: "B", label: "Вариант B" },
          { value: "C", label: "Вариант C" },
        ]}
        required
      />

      <SubmitButton type="submit" variant="primary" disabled={loading} fullWidth>
        {loading ? "Сохранение..." : "Сохранить вопрос"}
      </SubmitButton>
    </Form>
  );
}

const SubmitButton = styled(Button)`
  margin-top: ${theme.spacing.md};
`;
