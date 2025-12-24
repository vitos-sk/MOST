import styled from "styled-components";
import { validateQuestionForm } from "../utils/adminUtils";
import { Input, Textarea, Select, Button } from "../../../UI-components";
import { CategoryIcon } from "../../../UI-components/CategoryIcon/CategoryIcon";
import { theme, cardGlass } from "../../../../theme/theme";
import { useModal } from "../../../../context/ModalContext";

const Form = styled.form`
  ${cardGlass}
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  border-radius: ${theme.radius.lg};
  margin-bottom: ${theme.spacing.xl};
  box-shadow: ${theme.shadow.md};
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.bg.card};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
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
        label="Вопрос *"
        name="text"
        value={formData.text}
        onChange={onInputChange}
        placeholder="Введите вопрос"
        minHeight="100px"
        required
      />

      <FormRow>
        <Input
          label="Вариант A *"
          type="text"
          name="optionA"
          value={formData.optionA}
          onChange={onInputChange}
          placeholder="Первый вариант"
          required
        />

        <Input
          label="Вариант B *"
          type="text"
          name="optionB"
          value={formData.optionB}
          onChange={onInputChange}
          placeholder="Второй вариант"
          required
        />
      </FormRow>

      <Textarea
        label="Почему большинство выбирает этот вариант? *"
        name="majorityReason"
        value={formData.majorityReason}
        onChange={onInputChange}
        placeholder="Типичные аргументы большинства"
        minHeight="100px"
        required
      />

      <Textarea
        label="Почему часть людей выбирает другой вариант? *"
        name="minorityReason"
        value={formData.minorityReason}
        onChange={onInputChange}
        placeholder="Аргументы меньшинства"
        minHeight="100px"
        noMargin
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
