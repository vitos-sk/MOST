import styled from "styled-components";
import { validateCategoryForm } from "../utils/adminUtils";
import { Input, Button } from "../../../UI-components";
import { IconPicker } from "../../../UI-components/IconPicker";
import { theme, cardGlass } from "../../../../theme/theme";
import { useModal } from "../../../../context/ModalContext";

export function CategoryForm({ formData, loading, onInputChange, onSubmit }) {
  const { showError } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateCategoryForm(formData);
    if (!validation.valid) {
      showError(validation.error);
      return;
    }
    onSubmit();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow>
        <Input
          label="Название категории *"
          type="text"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder="Например: Асинхронные функции"
          required
        />

        <IconPicker
          label="Иконка категории *"
          value={formData.emoji}
          onChange={onInputChange}
        />
      </FormRow>

      <SubmitButton type="submit" disabled={loading} variant="primary" fullWidth>
        {loading ? "Сохранение..." : "Сохранить категорию"}
      </SubmitButton>
    </Form>
  );
}

const Form = styled.form`
  ${cardGlass}
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  border-radius: 0;
  margin-top: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  box-shadow: none;
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.bg.card};
  position: relative;
  z-index: 1;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const SubmitButton = styled(Button)`
  margin-top: ${theme.spacing.md};
`;
