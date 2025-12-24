import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUnansweredQuestions, addVote, getQuestionsByCategory } from "../../../API";
import { useAuth } from "../../../context/AuthContext";
import { Button as UIButton } from "../../UI-components";
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
            <BackButton onClick={() => navigate("/")}>Назад к категориям</BackButton>
          </ButtonWrapper>
        </ErrorContainer>
        <FixedBackButton onClick={() => navigate(-1)} aria-label="Назад">
          <BackIcon>‹</BackIcon>
        </FixedBackButton>
      </Container>
    );
  }

  if (questions.length === 0 && !error) {
    return (
      <Container>
        <SuccessContainer>
          <SuccessBox>
            <SuccessText>
              {isEmptyCategory
                ? "В этой категории пока нет вопросов"
                : "Вы ответили на все вопросы в этой категории!"}
            </SuccessText>
          </SuccessBox>
          <ButtonWrapper>
            <BackButton onClick={() => navigate("/")}>
              Выбрать другую категорию
            </BackButton>
          </ButtonWrapper>
        </SuccessContainer>
        <FixedBackButton onClick={() => navigate(-1)} aria-label="Назад">
          <BackIcon>‹</BackIcon>
        </FixedBackButton>
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

        <QuestionTitle>{currentQuestion.text}</QuestionTitle>

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
            <VoteCount>{currentQuestion.votesOptionA || 0} голосов</VoteCount>
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
            <VoteCount>{currentQuestion.votesOptionB || 0} голосов</VoteCount>
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
      <FixedBackButton onClick={() => navigate(-1)} aria-label="Назад">
        <BackIcon>‹</BackIcon>
      </FixedBackButton>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: ${theme.spacing.md};
  max-width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm};
    height: 100dvh;
  }
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
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  box-shadow: ${theme.shadow.md};
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
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const SuccessBox = styled.div`
  ${cardGlass}
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  box-shadow: ${theme.shadow.md};
  border-color: ${theme.colors.status.success};
`;

const SuccessText = styled.div`
  color: ${theme.colors.status.success};
  text-align: center;
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.semibold};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const BackButton = styled(UIButton)`
  background: ${theme.colors.bg.secondary};
  color: ${theme.colors.text.primary};
  border-color: ${theme.colors.border.default};

  &:hover:not(:disabled) {
    background: ${theme.colors.bg.cardHover};
    border-color: ${theme.colors.border.hover};
  }
`;

export const QuestionCard = styled.div`
  ${cardGlass}
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  box-shadow: ${theme.shadow.lg};
  animation: slideUp 0.3s ease-out;
  transition: all ${theme.transition.base};
  width: 100%;
  max-width: 600px;
  margin: auto;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
    max-height: calc(100vh - 32px);
    overflow-y: auto;
  }

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

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }

  &:hover {
    background: ${theme.colors.bg.cardHover};
    border-color: ${theme.colors.border.hover};
  }
`;

const QuestionCounter = styled.div`
  text-align: center;
  color: ${theme.colors.text.tertiary};
  font-size: ${theme.typography.sizes.sm};
  margin-bottom: ${theme.spacing.lg};
  font-weight: ${theme.typography.weights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const QuestionTitle = styled.h2`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.sizes.xl};
  text-align: center;
  margin: 0 0 ${theme.spacing.xl} 0;
  line-height: ${theme.typography.lineHeights.relaxed};
  font-weight: ${theme.typography.weights.semibold};

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes["2xl"]};
  }
`;

export const AnswerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

export const AnswerButton = styled.button`
  ${cardGlass}
  border: 2px solid ${(props) =>
    props.$selected ? theme.colors.border.accent : theme.colors.border.default};
  border-radius: ${theme.radius.md};
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  min-height: 80px;
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
  gap: ${theme.spacing.sm};
  position: relative;
  overflow: hidden;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
    min-height: auto;
  }

  ${(props) =>
    props.$selected &&
    `
    background: ${theme.colors.accent.gradientSoft};
    border-color: ${theme.colors.border.accentHover};
    box-shadow: ${theme.shadow.glow};
  `}

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${theme.colors.accent.gradientSoft};
    opacity: ${(props) => (props.$selected ? 1 : 0)};
    transition: opacity ${theme.transition.base};
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  /* Для мобильных: активное состояние вместо hover */
  &:active:not(:disabled) {
    transform: scale(0.98);
    border-color: ${theme.colors.border.accentHover};
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    &:hover:not(:disabled) {
      border-color: ${theme.colors.border.accentHover};
      background: ${theme.colors.bg.cardHover};
      transform: translateY(-2px);
      box-shadow: ${theme.shadow.md};
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: ${theme.shadow.sm};
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
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.accent.primary};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.accent.gradientSoft};
  border-radius: ${theme.radius.md};
  flex-shrink: 0;
`;

const OptionText = styled.div`
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeights.normal};

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes.lg};
  }
`;

const VoteCount = styled.div`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.tertiary};
  font-weight: ${theme.typography.weights.medium};
  white-space: nowrap;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: center;
`;

export const SubmitButton = styled(UIButton)`
  /* Styles are handled by Button component with variant="primary" */
`;

const FixedBackButton = styled.button`
  ${cardGlass}
  position: fixed;
  bottom: ${theme.spacing.md};
  left: ${theme.spacing.md};
  width: 56px;
  height: 56px;
  border-radius: ${theme.radius.full};
  border: 1px solid ${theme.colors.border.default};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition: all ${theme.transition.base};
  padding: 0;
  background: ${theme.colors.bg.glass};
  z-index: ${theme.zIndex.sticky};
  box-shadow: ${theme.shadow.md};

  /* Для мобильных: активное состояние вместо hover */
  &:active {
    transform: scale(0.95);
    background: ${theme.colors.bg.cardHover};
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 52px;
    height: 52px;
    bottom: ${theme.spacing.lg};
    left: ${theme.spacing.lg};

    &:hover {
      background: ${theme.colors.bg.cardHover};
      border-color: ${theme.colors.border.accent};
      transform: translateX(-2px);
      box-shadow: ${theme.shadow.lg};
    }

    &:active {
      transform: translateX(-1px);
    }
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent.primary};
    outline-offset: 2px;
  }
`;

const BackIcon = styled.span`
  font-size: ${theme.typography.sizes["2xl"]};
  color: ${theme.colors.text.primary};
  line-height: 1;
  font-weight: ${theme.typography.weights.bold};
`;
