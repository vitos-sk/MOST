import {
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  FormRow,
  Button,
} from "../../../styles/admin.styles";
import { validateQuestionForm } from "../../../services/adminUtils";

export default function QuestionForm({
  formData,
  categories,
  loading,
  onInputChange,
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateQuestionForm(formData);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }
    onSubmit();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Категория *</Label>
        <Select
          name="category"
          value={formData.category}
          onChange={onInputChange}
          required
        >
          <option value="">Выберите категорию</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.emoji} {cat.name}
            </option>
          ))}
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Вопрос *</Label>
        <TextArea
          name="text"
          value={formData.text}
          onChange={onInputChange}
          placeholder="Введите вопрос"
          required
        />
      </FormGroup>

      <FormRow>
        <FormGroup>
          <Label>🔴 Вариант A *</Label>
          <Input
            type="text"
            name="optionA"
            value={formData.optionA}
            onChange={onInputChange}
            placeholder="Первый вариант"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>🔵 Вариант B *</Label>
          <Input
            type="text"
            name="optionB"
            value={formData.optionB}
            onChange={onInputChange}
            placeholder="Второй вариант"
            required
          />
        </FormGroup>
      </FormRow>

      <FormGroup>
        <Label>Почему большинство выбирает этот вариант? *</Label>
        <TextArea
          name="majorityReason"
          value={formData.majorityReason}
          onChange={onInputChange}
          placeholder="Типичные аргументы большинства"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Почему часть людей выбирает другой вариант? *</Label>
        <TextArea
          name="minorityReason"
          value={formData.minorityReason}
          onChange={onInputChange}
          placeholder="Аргументы меньшинства"
          required
        />
      </FormGroup>

      <Button type="submit" disabled={loading}>
        {loading ? "⏳ Сохранение..." : "💾 Сохранить вопрос"}
      </Button>
    </Form>
  );
}
