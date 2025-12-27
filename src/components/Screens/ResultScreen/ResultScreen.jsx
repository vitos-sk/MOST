import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../../context/AuthContext";
import { useQuestion, useQuestionsByCategory, useVotesByQuestion } from "../../../hooks";
import { routeHelpers, ROUTES } from "../../../config/routes";
import { theme, cardGlass } from "../../../theme/theme";
import { Button as UIButton, BackButton } from "../../UI-components";
import { ResultOption, ResultStatus, CodeBlock } from "./components";

export function ResultScreen() {
  const { questionId, categoryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nextQuestion, setNextQuestion] = useState(null);
  const [userChoice, setUserChoice] = useState(null);

  // Hooks for data fetching
  const {
    question,
    loading: questionLoading,
    error: questionError,
  } = useQuestion(questionId);
  const { votes, loading: votesLoading } = useVotesByQuestion(questionId);
  const { questions: categoryQuestions } = useQuestionsByCategory(categoryId);

  const loading = questionLoading || votesLoading;
  const error = questionError;

  // Find user's choice
  useEffect(() => {
    if (votes && user?.id) {
      const userVote = votes.find((vote) => vote.userId === user.id);
      if (userVote) {
        setUserChoice(userVote.choice);
      }
    }
  }, [votes, user?.id]);

  // Find next question
  useEffect(() => {
    if (categoryQuestions.length > 0 && questionId) {
      const currentIndex = categoryQuestions.findIndex((q) => q.id === questionId);
      if (currentIndex !== -1 && currentIndex < categoryQuestions.length - 1) {
        setNextQuestion(categoryQuestions[currentIndex + 1]);
      }
    }
  }, [categoryQuestions, questionId]);

  const handleNextQuestion = () => {
    if (nextQuestion && categoryId) {
      navigate(routeHelpers.questions(categoryId), {
        state: { startFromQuestionId: nextQuestion.id },
      });
    } else if (categoryId) {
      navigate(routeHelpers.questions(categoryId));
    } else {
      navigate(ROUTES.HOME);
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
            <UIButton onClick={() => navigate(ROUTES.HOME)} variant="secondary">
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

  return (
    <Container>
      <ResultBox>
        <Title>Результаты</Title>

        <ResultStatus isCorrect={isCorrect} />

        <CodeBlock code={question.code} />

        <ResultOption
          optionKey="A"
          optionText={question.optionA}
          percentage={percentageA}
          voteCount={question.votesOptionA || 0}
          isUserChoice={userChoice === "A"}
          isCorrectOption={correctAnswer === "A"}
        />
        <ResultOption
          optionKey="B"
          optionText={question.optionB}
          percentage={percentageB}
          voteCount={question.votesOptionB || 0}
          isUserChoice={userChoice === "B"}
          isCorrectOption={correctAnswer === "B"}
        />
        <ResultOption
          optionKey="C"
          optionText={question.optionC}
          percentage={percentageC}
          voteCount={question.votesOptionC || 0}
          isUserChoice={userChoice === "C"}
          isCorrectOption={correctAnswer === "C"}
        />

        <ButtonGroup>
          <UIButton onClick={() => navigate(ROUTES.HOME)} variant="secondary">
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
