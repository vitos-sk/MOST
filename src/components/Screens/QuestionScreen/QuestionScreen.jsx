import styled from "styled-components";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../context/ModalContext";
import {
  useUnansweredQuestions,
  useQuestionsByCategory,
  useSubmitVote,
} from "../../../hooks";
import { routeHelpers, ROUTES } from "../../../config/routes";
import { Button as UIButton, BackButton } from "../../UI-components";
import { theme, cardGlass } from "../../../theme/theme";
import { AnswerOption, QuestionCodeBlock } from "./components";

export function QuestionScreen() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { showError } = useModal();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isRestartMode, setIsRestartMode] = useState(
    location.state?.isRestartMode || false
  );

  // Hooks for data fetching
  const {
    questions: unansweredQuestions,
    loading: unansweredLoading,
    error: unansweredError,
    refetch: refetchUnanswered,
  } = useUnansweredQuestions(user?.id, categoryId);

  const {
    questions: allCategoryQuestions,
    loading: allQuestionsLoading,
    error: allQuestionsError,
    refetch: refetchAllQuestions,
  } = useQuestionsByCategory(categoryId);

  const { submitVote, loading: voting } = useSubmitVote();

  // Determine which questions to use and loading state
  const questions = isRestartMode ? allCategoryQuestions : unansweredQuestions;
  const loading = isRestartMode ? allQuestionsLoading : unansweredLoading;
  const error = isRestartMode ? allQuestionsError : unansweredError;
  const isEmptyCategory = allCategoryQuestions.length === 0;

  // Handle navigation state (startFromQuestionId and isRestartMode)
  useEffect(() => {
    const navIsRestartMode = location.state?.isRestartMode;
    if (navIsRestartMode !== undefined && navIsRestartMode !== isRestartMode) {
      setIsRestartMode(navIsRestartMode);
    }
  }, [location.state?.isRestartMode, isRestartMode]);

  // Set question index based on startFromQuestionId or reset
  useEffect(() => {
    if (questions.length > 0) {
      const startFromQuestionId = location.state?.startFromQuestionId;
      if (startFromQuestionId) {
        const targetIndex = questions.findIndex((q) => q.id === startFromQuestionId);
        if (targetIndex !== -1) {
          setCurrentQuestionIndex(targetIndex);
        } else {
          setCurrentQuestionIndex(0);
        }
      } else {
        setCurrentQuestionIndex(0);
      }
      setSelectedOption(null);
    }
  }, [questions, categoryId, isRestartMode, location.state?.startFromQuestionId]);

  const handleVote = async () => {
    if (!selectedOption || !user?.id) {
      showError("Ошибка: не удалось получить ID пользователя");
      return;
    }

    try {
      const currentQuestion = questions[currentQuestionIndex];
      const result = await submitVote(user.id, currentQuestion.id, selectedOption);
      if (result?.success) {
        navigate(routeHelpers.results(currentQuestion.id, categoryId), {
          state: { isRestartMode },
        });
      }
    } catch (err) {
      showError("Ошибка при голосовании");
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      navigate(ROUTES.HOME);
    }
  };

  const handleRestart = async () => {
    if (!categoryId) return;
    // Reset state first
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    // Switch to restart mode
    setIsRestartMode(true);
    // Wait for questions to be fetched
    await refetchAllQuestions();
    // Clear location state to avoid conflicts
    navigate(routeHelpers.questions(categoryId), {
      state: { isRestartMode: true },
      replace: true,
    });
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
            <UIButton onClick={() => navigate(ROUTES.HOME)} variant="secondary">
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
                <UIButton onClick={() => navigate(ROUTES.HOME)} variant="secondary">
                  Выбрать другую категорию
                </UIButton>
              </ButtonWrapper>
            )}
            {isEmptyCategory && (
              <ButtonWrapper>
                <UIButton onClick={() => navigate(ROUTES.HOME)} variant="secondary">
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

  if (!currentQuestion) {
    return (
      <Container>
        <LoadingText>Загрузка вопроса...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <QuestionCard>
        <QuestionCodeBlock code={currentQuestion.code} />

        <AnswerList>
          <AnswerOption
            optionKey="A"
            optionText={currentQuestion.optionA}
            voteCount={currentQuestion.votesOptionA || 0}
            isSelected={selectedOption === "A"}
            onClick={() => setSelectedOption("A")}
            disabled={voting}
          />
          <AnswerOption
            optionKey="B"
            optionText={currentQuestion.optionB}
            voteCount={currentQuestion.votesOptionB || 0}
            isSelected={selectedOption === "B"}
            onClick={() => setSelectedOption("B")}
            disabled={voting}
          />
          <AnswerOption
            optionKey="C"
            optionText={currentQuestion.optionC}
            voteCount={currentQuestion.votesOptionC || 0}
            isSelected={selectedOption === "C"}
            onClick={() => setSelectedOption("C")}
            disabled={voting}
          />
        </AnswerList>

        <ActionsContainer>
          <UIButton
            onClick={() => navigate(ROUTES.HOME)}
            disabled={voting}
            variant="secondary"
          >
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

export const AnswerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.sm};
  flex-shrink: 0;
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
