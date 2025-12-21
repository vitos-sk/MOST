import {
  Form,
  FormGroup,
  Label,
  Input,
  FormRow,
  Button,
} from "../../../styles/admin.styles";
import { validateCategoryForm } from "../../../services/adminUtils";

export default function CategoryForm({ formData, loading, onInputChange, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateCategoryForm(formData);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }
    onSubmit();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow>
        <FormGroup>
          <Label>Название категории *</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Например: Здоровье"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Эмодзи *</Label>
          <Input
            type="text"
            name="emoji"
            value={formData.emoji}
            onChange={onInputChange}
            placeholder="Например: 🏥"
            maxLength="2"
            required
          />
        </FormGroup>
      </FormRow>

      <Button type="submit" disabled={loading}>
        {loading ? "⏳ Сохранение..." : "💾 Сохранить категорию"}
      </Button>
    </Form>
  );
}
