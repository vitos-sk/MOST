/**
 * Утилиты для админ-панели
 */

export const getCategoryName = (categoryId, categories) => {
  const cat = categories.find((c) => c.id === categoryId);
  return cat ? `${cat.emoji} ${cat.name}` : categoryId;
};

export const validateQuestionForm = (formData) => {
  const { category, text, optionA, optionB, majorityReason, minorityReason } = formData;

  if (!category || !text || !optionA || !optionB || !majorityReason || !minorityReason) {
    return { valid: false, error: "Заполните все поля" };
  }

  if (text.length < 10) {
    return { valid: false, error: "Вопрос должен быть минимум 10 символов" };
  }

  return { valid: true };
};

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

export const handleAsyncAction = async (
  action,
  successMessage,
  errorMessage,
  onSuccess
) => {
  try {
    await action();
    alert(`✅ ${successMessage}`);
    if (onSuccess) await onSuccess();
  } catch (error) {
    console.error(errorMessage, error);
    alert(`❌ ${errorMessage}`);
  }
};
