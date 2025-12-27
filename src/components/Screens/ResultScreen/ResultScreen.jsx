import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getQuestionsByCategory, getQuestions, getVotesByQuestion } from "../../../API";
import { theme, cardGlass } from "../../../theme/theme";
import { useAuth } from "../../../context/AuthContext";
import { CodeHighlight, Button as UIButton, BackButton } from "../../UI-components";

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
          setUserChoice(userVote.choice); // 'A', 'B' или 'C'
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
          <ButtonGroup>
            <UIButton onClick={() => navigate("/")} variant="secondary">
              Назад к категориям
            </UIButton>
          </ButtonGroup>
        </ResultBox>
        <BackButton onClick={() => navigate(-1)} />
      </Container>
    );
  }

  const totalVotes =
    (question.votesOptionA || 0) +
    (question.votesOptionB || 0) +
    (question.votesOptionC || 0);
  const percentageA =
    totalVotes > 0 ? Math.round(((question.votesOptionA || 0) / totalVotes) * 100) : 0;
  const percentageB =
    totalVotes > 0 ? Math.round(((question.votesOptionB || 0) / totalVotes) * 100) : 0;
  const percentageC = totalVotes > 0 ? 100 - percentageA - percentageB : 0;

  const correctAnswer = question.correctAnswer || "A";
  const isCorrect = userChoice === correctAnswer;

  const renderOption = (optionKey, optionText, percentage, voteCount) => {
    const isUserChoice = userChoice === optionKey;
    const isCorrectOption = correctAnswer === optionKey;
    const showCorrectBadge = isCorrectOption;
    const showWrongBadge = isUserChoice && !isCorrectOption;

    return (
      <StatisticsBlock key={optionKey}>
        <OptionLabel>
          <OptionName>
            Вариант {optionKey}: {optionText}
            {showCorrectBadge && <CorrectBadge>✓ Правильный ответ</CorrectBadge>}
            {showWrongBadge && <WrongBadge>✗ Ваш ответ</WrongBadge>}
          </OptionName>
          <PercentageLabel>{percentage}%</PercentageLabel>
        </OptionLabel>
        <ProgressBar>
          <ProgressFill
            $option={optionKey}
            $width={percentage}
            $isCorrect={isCorrectOption}
            $isUserChoice={isUserChoice && !isCorrectOption}
          >
            {percentage > 10 && `${percentage}%`}
          </ProgressFill>
        </ProgressBar>
        <VoteCount>{voteCount}</VoteCount>
      </StatisticsBlock>
    );
  };

  return (
    <Container>
      <ResultBox>
        <Title>Результаты</Title>

        <ResultStatus $isCorrect={isCorrect}>
          {isCorrect ? (
            <>
              <StatusIcon>✓</StatusIcon>
              <StatusText>Правильно!</StatusText>
            </>
          ) : (
            <>
              <StatusIcon $wrong>✗</StatusIcon>
              <StatusText>Неправильно</StatusText>
            </>
          )}
        </ResultStatus>

        <CodeBlock>
          <CodeLabel>Код</CodeLabel>
          <CodeHighlight code={question.code} language="javascript" />
        </CodeBlock>

        {renderOption("A", question.optionA, percentageA, question.votesOptionA || 0)}
        {renderOption("B", question.optionB, percentageB, question.votesOptionB || 0)}
        {renderOption("C", question.optionC, percentageC, question.votesOptionC || 0)}

        <ButtonGroup>
          <UIButton onClick={() => navigate("/")} variant="secondary">
            На главную
          </UIButton>
          <UIButton onClick={handleNextQuestion} variant="primary">
            {nextQuestion ? "Следующий вопрос" : "Вернуться к вопросам"}
          </UIButton>
        </ButtonGroup>
      </ResultBox>
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

export const ResultBox = styled.div`
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
`;

const Title = styled.h2`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.sizes.base};
  margin: 0 0 ${theme.spacing.sm} 0;
  text-align: center;
  font-weight: ${theme.typography.weights.bold};
  letter-spacing: -0.02em;
`;

export const StatisticsBlock = styled.div`
  margin-bottom: ${theme.spacing.sm};

  &:last-of-type {
    margin-bottom: ${theme.spacing.sm};
  }
`;

const OptionLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xs};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
`;

const OptionName = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.primary};
`;

export const PercentageLabel = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.accent.primary};
  font-weight: ${theme.typography.weights.medium};
`;

export const ProgressBar = styled.div`
  background: ${theme.colors.progress.bg};
  height: 24px;
  border-radius: 0;
  overflow: hidden;
  position: relative;
  border: none;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${(props) => props.$width}%;
  background: ${(props) => {
    if (props.$isCorrect) return "#27ae60";
    if (props.$isUserChoice) return "#e74c3c";
    if (props.$option === "A") return theme.colors.progress.optionA;
    if (props.$option === "B") return theme.colors.progress.optionB;
    return "#9333ea";
  }};
  transition: width ${theme.transition.slower} cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$width > 10 ? "flex-end" : "center")};
  padding: 0 ${theme.spacing.xs};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.weights.medium};
  font-size: ${theme.typography.sizes.xs};
  position: relative;
  overflow: hidden;
  animation: fillProgress 0.5s ease-out;

  @keyframes fillProgress {
    from {
      width: 0;
    }
  }
`;

const VoteCount = styled.div`
  margin-top: ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.tertiary};
  font-weight: ${theme.typography.weights.medium};
`;

const ResultStatus = styled.div`
  ${cardGlass}
  padding: ${theme.spacing.sm};
  border-radius: 0;
  margin-bottom: ${theme.spacing.sm};
  border: none;
  background: ${theme.colors.bg.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
`;

const StatusIcon = styled.span`
  font-size: ${theme.typography.sizes.base};
  color: ${(props) => (props.$wrong ? "#e74c3c" : "#27ae60")};
  font-weight: ${theme.typography.weights.bold};
`;

const StatusText = styled.span`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
`;

const CorrectBadge = styled.span`
  display: inline-block;
  margin-left: ${theme.spacing.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: #27ae60;
  color: white;
  border-radius: 0;
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.bold};
`;

const WrongBadge = styled.span`
  display: inline-block;
  margin-left: ${theme.spacing.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: #e74c3c;
  color: white;
  border-radius: 0;
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.bold};
`;

const CodeBlock = styled.div`
  ${cardGlass}
  border-radius: 0;
  padding: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.sm};
  border: none;
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

const CodeIcon = styled.span`
  font-size: ${theme.typography.sizes.xl};
  filter: grayscale(0.2);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${theme.spacing.md};
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
  border-radius: 0;
  border-color: ${theme.colors.status.error};
`;
