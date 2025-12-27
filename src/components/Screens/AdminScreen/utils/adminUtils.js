// Validate question form data
export const validateQuestionForm = (formData) => {
  const { category, code, optionA, optionB, optionC, correctAnswer } = formData;

  if (!category || !code || !optionA || !optionB || !optionC || !correctAnswer) {
    return { valid: false, error: "Заполните все поля" };
  }

  if (code.trim().length < 5) {
    return { valid: false, error: "Код должен быть минимум 5 символов" };
  }

  if (!["A", "B", "C"].includes(correctAnswer)) {
    return { valid: false, error: "Выберите правильный ответ (A, B или C)" };
  }

  return { valid: true };
};

// Validate category form data
export const validateCategoryForm = (formData) => {
  const { name, emoji } = formData;

  if (!name || !emoji) {
    return { valid: false, error: "Заполните название и эмодзи" };
  }

  if (name.length < 2) {
    return { valid: false, error: "Название должно быть минимум 2 символа" };
  }

  return { valid: true };
};
