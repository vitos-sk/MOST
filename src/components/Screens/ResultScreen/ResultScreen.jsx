import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getQuestionsByCategory, getQuestions, getVotesByQuestion } from "../../../API";
import { theme, cardGlass } from "../../../theme/theme";
import { useAuth } from "../../../context/AuthContext";

export function ResultScreen() {
  const { questionId, categoryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [nextQuestion, setNextQuestion] = useState(null);
  const [votes, setVotes] = useState(null);
  const [userChoice, setUserChoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResultData();
  }, [questionId, categoryId]);

  const loadResultData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Получить все вопросы и найти нужный
      const allQuestions = await getQuestions();
      const q = allQuestions.find((q) => q.id === questionId);

      if (!q) {
        setError("Вопрос не найден");
        return;
      }

      setQuestion(q);

      // Получить голоса
      const voteData = await getVotesByQuestion(questionId);
      setVotes(voteData);

      // Найти выбор текущего пользователя
      if (user?.id) {
        const userVote = voteData.find((vote) => vote.userId === user.id);
        if (userVote) {
          setUserChoice(userVote.choice); // 'A' или 'B'
        }
      }

      // Получить следующий вопрос из этой же категории
      if (categoryId) {
        const categoryQuestions = await getQuestionsByCategory(categoryId);
        const currentIndex = categoryQuestions.findIndex((q) => q.id === questionId);

        if (currentIndex !== -1 && currentIndex < categoryQuestions.length - 1) {
          setNextQuestion(categoryQuestions[currentIndex + 1]);
        }
      }
    } catch (err) {
      setError("Ошибка загрузки результатов");
    }
    setLoading(false);
  };

  const handleNextQuestion = () => {
    if (nextQuestion && categoryId) {
      // Переход к следующему вопросу через QuestionScreen
      navigate(`/questions/${categoryId}`, {
        state: { startFromQuestionId: nextQuestion.id },
      });
    } else if (categoryId) {
      // Вернуться к списку вопросов категории
      navigate(`/questions/${categoryId}`);
    } else {
      // Если нет categoryId, вернуться на главную
      navigate("/");
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingText>Загрузка результатов...</LoadingText>
      </Container>
    );
  }

  if (error || !question) {
    return (
      <Container>
        <ResultBox>
          <ErrorText>{error || "Ошибка загрузки"}</ErrorText>
        </ResultBox>
        <ButtonWrapper>
          <BackButton onClick={() => navigate("/")}>Назад к категориям</BackButton>
        </ButtonWrapper>
        <FixedBackButton onClick={() => navigate(-1)} aria-label="Назад">
          <BackIcon>‹</BackIcon>
        </FixedBackButton>
      </Container>
    );
  }

  const totalVotes = (question.votesOptionA || 0) + (question.votesOptionB || 0);
  const percentageA =
    totalVotes > 0 ? Math.round((question.votesOptionA / totalVotes) * 100) : 0;
  const percentageB = totalVotes > 0 ? 100 - percentageA : 0;

  const isMajorityA = percentageA >= 50;

  // Определяем, какое объяснение показывать пользователю
  // Объяснение должно показывать причину выбора варианта большинством,
  // независимо от выбора пользователя
  const getExplanationForUser = () => {
    if (isMajorityA) {
      // Большинство выбрало вариант A
      return {
        title: "Почему большинство выбирает первый вариант?",
        text: question.majorityReason,
      };
    } else {
      // Большинство выбрало вариант B
      return {
        title: "Почему большинство выбирает второй вариант?",
        text: question.minorityReason,
      };
    }
  };

  const explanation = getExplanationForUser();

  return (
    <Container>
      <ResultBox>
        <Title>Результаты голосования</Title>

        <StatisticsBlock>
          <OptionLabel>
            <OptionName>Вариант A: {question.optionA}</OptionName>
            <PercentageLabel>{percentageA}%</PercentageLabel>
          </OptionLabel>
          <ProgressBar>
            <ProgressFill $isA={true} $width={percentageA}>
              {percentageA > 15 && `${percentageA}%`}
            </ProgressFill>
          </ProgressBar>
          <VoteCount>{question.votesOptionA || 0} голосов</VoteCount>
        </StatisticsBlock>

        <StatisticsBlock>
          <OptionLabel>
            <OptionName>Вариант B: {question.optionB}</OptionName>
            <PercentageLabel>{percentageB}%</PercentageLabel>
          </OptionLabel>
          <ProgressBar>
            <ProgressFill $isA={false} $width={percentageB}>
              {percentageB > 15 && `${percentageB}%`}
            </ProgressFill>
          </ProgressBar>
          <VoteCount>{question.votesOptionB || 0} голосов</VoteCount>
        </StatisticsBlock>

        <ExplanationBlock>
          <ExplanationTitle>{explanation.title}</ExplanationTitle>
          <ExplanationText>{explanation.text}</ExplanationText>
        </ExplanationBlock>

        <ButtonGroup>
          <BackButton onClick={() => navigate("/")}>На главную</BackButton>
          <ContinueButton onClick={handleNextQuestion}>
            {nextQuestion ? "Следующий вопрос" : "Вернуться к вопросам"}
          </ContinueButton>
        </ButtonGroup>
      </ResultBox>
      <FixedBackButton onClick={() => navigate(-1)} aria-label="Назад">
        <BackIcon>‹</BackIcon>
      </FixedBackButton>
    </Container>
  );
}

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: ${theme.spacing.md};
  min-height: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-family: ${theme.typography.fontFamily};
  overflow-y: auto;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.sm};
    height: 100dvh;
  }
`;

export const ResultBox = styled.div`
  ${cardGlass}
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  box-shadow: ${theme.shadow.lg};
  margin-bottom: ${theme.spacing.lg};
  animation: slideUp 0.3s ease-out;
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
`;

const Title = styled.h2`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.sizes.xl};
  margin: 0 0 ${theme.spacing.xl} 0;
  text-align: center;
  font-weight: ${theme.typography.weights.bold};

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes["2xl"]};
  }
`;

export const StatisticsBlock = styled.div`
  margin-bottom: ${theme.spacing.xl};

  &:last-of-type {
    margin-bottom: ${theme.spacing.xl};
  }
`;

const OptionLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
`;

const OptionName = styled.span`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.text.primary};

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes.md};
  }
`;

export const PercentageLabel = styled.span`
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.accent.primary};
  font-weight: ${theme.typography.weights.bold};

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes.lg};
  }
`;

export const ProgressBar = styled.div`
  background: ${theme.colors.progress.bg};
  height: 32px;
  border-radius: ${theme.radius.full};
  overflow: hidden;
  position: relative;
  border: 1px solid ${theme.colors.border.default};

  @media (min-width: ${theme.breakpoints.sm}) {
    height: 36px;
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${(props) => props.$width}%;
  background: ${(props) =>
    props.$isA ? theme.colors.progress.optionA : theme.colors.progress.optionB};
  transition: width ${theme.transition.slower} cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$width > 15 ? "flex-end" : "center")};
  padding: 0 ${theme.spacing.md};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.sm};
  position: relative;
  overflow: hidden;
  animation: fillProgress 0.5s ease-out;

  @keyframes fillProgress {
    from {
      width: 0;
    }
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(200%);
    }
  }
`;

const VoteCount = styled.div`
  margin-top: ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.tertiary};
  font-weight: ${theme.typography.weights.medium};
`;

export const ExplanationBlock = styled.div`
  ${cardGlass}
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  border-radius: ${theme.radius.md};
  margin-top: ${theme.spacing.md};
  border-left: 4px solid ${theme.colors.accent.primary};
  transition: all ${theme.transition.base};

  &:first-of-type {
    margin-top: ${theme.spacing.xl};
  }

  &:hover {
    background: ${theme.colors.bg.cardHover};
    border-left-color: ${theme.colors.accent.secondary};
    transform: translateX(4px);
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }
`;

const ExplanationTitle = styled.h4`
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.bold};
  line-height: ${theme.typography.lineHeights.normal};
`;

const ExplanationText = styled.p`
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: ${theme.typography.lineHeights.relaxed};
  font-size: ${theme.typography.sizes.base};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.xl};
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  min-height: 36px;
  border: none;
  border-radius: ${theme.radius.md};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  font-weight: ${theme.typography.weights.semibold};
  font-size: ${theme.typography.sizes.base};
  transition: all ${theme.transition.base};
  font-family: ${theme.typography.fontFamily};

  /* Для мобильных: активное состояние вместо hover */
  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    min-height: auto;
    &:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ContinueButton = styled(Button)`
  background: ${theme.colors.accent.gradient};
  color: ${theme.colors.text.primary};
  box-shadow: ${theme.shadow.glow};

  &:hover:not(:disabled) {
    box-shadow: ${theme.shadow.glowStrong};
    filter: brightness(1.1);
  }
`;

const BackButton = styled(Button)`
  ${cardGlass}
  color: ${theme.colors.text.primary};
  border: 1px solid ${theme.colors.border.default};

  &:hover:not(:disabled) {
    background: ${theme.colors.bg.cardHover};
    border-color: ${theme.colors.border.hover};
    box-shadow: ${theme.shadow.md};
  }
`;

const LoadingText = styled.div`
  color: ${theme.colors.text.secondary};
  text-align: center;
  font-size: ${theme.typography.sizes.md};
  padding: ${theme.spacing.xxl} ${theme.spacing.md};
`;

const ErrorText = styled.div`
  color: ${theme.colors.status.error};
  text-align: center;
  font-size: ${theme.typography.sizes.base};
  ${cardGlass}
  padding: ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  border-color: ${theme.colors.status.error};
`;

const ButtonWrapper = styled.div`
  text-align: center;
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

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 52px;
    height: 52px;
    bottom: ${theme.spacing.lg};
    left: ${theme.spacing.lg};
  }
`;

const BackIcon = styled.span`
  font-size: ${theme.typography.sizes["2xl"]};
  color: ${theme.colors.text.primary};
  line-height: 1;
  font-weight: ${theme.typography.weights.bold};
`;
