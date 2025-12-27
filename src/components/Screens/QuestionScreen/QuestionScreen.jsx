import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUnansweredQuestions, addVote, getQuestionsByCategory } from "../../../API";
import { useAuth } from "../../../context/AuthContext";
import { Button as UIButton, CodeHighlight, BackButton } from "../../UI-components";
import { theme, cardGlass } from "../../../theme/theme";
import { useModal } from "../../../context/ModalContext";

export function QuestionScreen() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError } = useModal();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState(null);
  const [isEmptyCategory, setIsEmptyCategory] = useState(false);
  const [isRestartMode, setIsRestartMode] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadQuestions();
    }
  }, [categoryId, user]);

  const loadQuestions = async () => {
    if (!user?.id) {
      setError("Не удалось получить данные пользователя");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setIsEmptyCategory(false);

    try {
      // Сначала проверим, есть ли вообще вопросы в категории
      const allCategoryQuestions = await getQuestionsByCategory(categoryId);

      if (allCategoryQuestions.length === 0) {
        // В категории нет вопросов вообще
        setIsEmptyCategory(true);
        setError(null);
      } else {
        // Есть вопросы, получаем неотвеченные
        const unansweredQuestions = await getUnansweredQuestions(user.id, categoryId);

        if (unansweredQuestions.length === 0) {
          // Все вопросы отвечены
          setIsEmptyCategory(false);
          setError(null);
        } else {
          // Есть неотвеченные вопросы
          setQuestions(unansweredQuestions);
          setCurrentQuestionIndex(0);
          setSelectedOption(null);
        }
      }
    } catch (err) {
      setError("Ошибка загрузки вопросов");
      setIsEmptyCategory(false);
    }
    setLoading(false);
  };

  const handleVote = async () => {
    if (!selectedOption) {
      return;
    }

    if (!user?.id) {
      showError("Ошибка: не удалось получить ID пользователя");
      return;
    }

    setVoting(true);
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const userId = user.id;
      const result = await addVote(userId, currentQuestion.id, selectedOption);
      if (!result.success) {
        setVoting(false);
        return;
      }
      navigate(`/results/${currentQuestion.id}/${categoryId}`);
    } catch (err) {
      showError("Ошибка при голосовании");
      setVoting(false);
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      navigate("/");
    }
  };

  const handleRestart = async () => {
    if (!categoryId) return;

    setLoading(true);
    setError(null);
    setIsEmptyCategory(false);
    setIsRestartMode(true);

    try {
      // Загружаем все вопросы категории для повторного прохождения
      const allCategoryQuestions = await getQuestionsByCategory(categoryId);

      if (allCategoryQuestions.length === 0) {
        setIsEmptyCategory(true);
        setIsRestartMode(false);
      } else {
        setQuestions(allCategoryQuestions);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
      }
    } catch (err) {
      setError("Ошибка загрузки вопросов");
      setIsEmptyCategory(false);
      setIsRestartMode(false);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Container>
        <LoadingText>Загрузка вопросов...</LoadingText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorBox>
            <ErrorText>{error}</ErrorText>
          </ErrorBox>
          <ButtonWrapper>
            <UIButton onClick={() => navigate("/")} variant="secondary">
              Назад к категориям
            </UIButton>
          </ButtonWrapper>
        </ErrorContainer>
        <BackButton onClick={() => navigate(-1)} />
      </Container>
    );
  }

  if (questions.length === 0 && !error) {
    return (
      <Container>
        <SuccessContainer>
          <SuccessBox>
            <SuccessTitle>
              {isEmptyCategory ? "Категория пуста" : "Поздравляем!"}
            </SuccessTitle>
            <SuccessText>
              {isEmptyCategory
                ? "В этой категории пока нет вопросов"
                : "Вы ответили на все вопросы в этой категории!"}
            </SuccessText>
            {!isEmptyCategory && (
              <ButtonWrapper>
                <UIButton onClick={handleRestart} variant="primary">
                  Начать заново
                </UIButton>
                <UIButton onClick={() => navigate("/")} variant="secondary">
                  Выбрать другую категорию
                </UIButton>
              </ButtonWrapper>
            )}
            {isEmptyCategory && (
              <ButtonWrapper>
                <UIButton onClick={() => navigate("/")} variant="secondary">
                  Выбрать другую категорию
                </UIButton>
              </ButtonWrapper>
            )}
          </SuccessBox>
        </SuccessContainer>
        <BackButton onClick={() => navigate(-1)} />
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  return (
    <Container>
      <QuestionCard>
        <QuestionCounter>
          Вопрос {currentQuestionIndex + 1} из {totalQuestions}
        </QuestionCounter>

        <CodeBlock>
          <CodeLabel>Код</CodeLabel>
          <CodeHighlight code={currentQuestion.code} language="javascript" />
        </CodeBlock>

        <AnswerList>
          <AnswerButton
            $selected={selectedOption === "A"}
            onClick={() => setSelectedOption("A")}
            disabled={voting}
          >
            <OptionContent>
              <OptionIcon>A</OptionIcon>
              <OptionText>{currentQuestion.optionA}</OptionText>
            </OptionContent>
            <VoteCount>{currentQuestion.votesOptionA || 0}</VoteCount>
          </AnswerButton>

          <AnswerButton
            $selected={selectedOption === "B"}
            onClick={() => setSelectedOption("B")}
            disabled={voting}
          >
            <OptionContent>
              <OptionIcon>B</OptionIcon>
              <OptionText>{currentQuestion.optionB}</OptionText>
            </OptionContent>
            <VoteCount>{currentQuestion.votesOptionB || 0}</VoteCount>
          </AnswerButton>

          <AnswerButton
            $selected={selectedOption === "C"}
            onClick={() => setSelectedOption("C")}
            disabled={voting}
          >
            <OptionContent>
              <OptionIcon>C</OptionIcon>
              <OptionText>{currentQuestion.optionC}</OptionText>
            </OptionContent>
            <VoteCount>{currentQuestion.votesOptionC || 0}</VoteCount>
          </AnswerButton>
        </AnswerList>

        <ActionsContainer>
          <UIButton onClick={() => navigate("/")} disabled={voting} variant="secondary">
            К категориям
          </UIButton>

          {currentQuestionIndex < totalQuestions - 1 && (
            <UIButton onClick={handleSkipQuestion} disabled={voting} variant="outline">
              Пропустить
            </UIButton>
          )}

          <SubmitButton
            onClick={handleVote}
            disabled={voting || !selectedOption}
            variant="primary"
          >
            {voting ? "Отправка..." : "Ответить"}
          </SubmitButton>
        </ActionsContainer>
      </QuestionCard>
      <BackButton onClick={() => navigate(-1)} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: ${theme.spacing.sm};
  max-width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${theme.colors.bg.primary};
`;

const LoadingText = styled.div`
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.md};
  padding: ${theme.spacing.xxl} ${theme.spacing.md};
`;

const ErrorContainer = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const ErrorBox = styled.div`
  ${cardGlass}
  border-radius: 0;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  border-color: ${theme.colors.status.error};
`;

const ErrorText = styled.div`
  color: ${theme.colors.status.error};
  text-align: center;
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.medium};
`;

const SuccessContainer = styled.div`
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SuccessBox = styled.div`
  ${cardGlass}
  border-radius: 0;
  padding: ${theme.spacing.md};
  border: none;
  background: ${theme.colors.bg.card};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
  animation: slideUp 0.3s ease-out;
  width: 100%;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SuccessTitle = styled.div`
  color: ${theme.colors.text.primary};
  text-align: center;
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  letter-spacing: -0.02em;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes["2xl"]};
  }
`;

const SuccessText = styled.div`
  color: ${theme.colors.text.secondary};
  text-align: center;
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.medium};
  line-height: ${theme.typography.lineHeights.relaxed};

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes.lg};
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;

export const QuestionCard = styled.div`
  ${cardGlass}
  border-radius: 0;
  padding: ${theme.spacing.md};
  animation: slideUp 0.3s ease-out;
  transition: all ${theme.transition.base};
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  background: ${theme.colors.bg.card};
  display: flex;
  flex-direction: column;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
    max-height: calc(100vh - 8px);
    overflow-y: auto;
    border-radius: 0;
  }
`;

const QuestionCounter = styled.div`
  text-align: center;
  color: ${theme.colors.text.tertiary};
  font-size: ${theme.typography.sizes.xs};
  margin-bottom: ${theme.spacing.sm};
  font-weight: ${theme.typography.weights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: ${theme.spacing.xs};
  background: ${theme.colors.bg.secondary};
  border-radius: 0;
  display: block;
  width: 100%;
`;

const CodeBlock = styled.div`
  ${cardGlass}
  border-radius: 0;
  padding: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.sm};
  background: ${theme.colors.bg.secondary};
  position: relative;
  overflow: hidden;
  flex-shrink: 1;
  min-height: 0;
`;

const CodeLabel = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};
  margin-bottom: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const AnswerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.sm};
  flex-shrink: 0;
`;

export const AnswerButton = styled.button`
  ${cardGlass}
  border: none;
  border-radius: 0;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  min-height: 50px;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition: all ${theme.transition.base};
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
  position: relative;
  overflow: hidden;
  background: ${(props) =>
    props.$selected ? theme.colors.bg.secondary : theme.colors.bg.card};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: ${theme.colors.accent.primary};
    opacity: ${(props) => (props.$selected ? 1 : 0)};
    transition: opacity ${theme.transition.base};
    z-index: 2;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  /* Для мобильных: активное состояние вместо hover */
  &:active:not(:disabled) {
    background: ${theme.colors.bg.secondary};
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    &:hover:not(:disabled) {
      background: ${theme.colors.bg.secondary};
    }

    &:active:not(:disabled) {
      background: ${theme.colors.bg.secondary};
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const OptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  flex: 1;
  min-width: 0;
`;

const OptionIcon = styled.span`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.bg.secondary};
  border: none;
  border-radius: 0;
  flex-shrink: 0;
`;

const OptionText = styled.div`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeights.tight};
`;

const VoteCount = styled.div`
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.text.tertiary};
  font-weight: ${theme.typography.weights.normal};
  white-space: nowrap;
  opacity: 0.6;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${theme.spacing.md};
  flex-shrink: 0;
`;

export const SubmitButton = styled(UIButton)``;
