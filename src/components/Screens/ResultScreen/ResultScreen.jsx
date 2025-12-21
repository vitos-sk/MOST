import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getQuestions,
  getVotesByQuestion,
  getQuestionsByCategory,
} from "../../../services/firestoreService";

export default function ResultScreen() {
  const { questionId, categoryId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [nextQuestion, setNextQuestion] = useState(null);
  const [votes, setVotes] = useState(null);
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

      // Получить следующий вопрос из этой же категории
      if (categoryId) {
        const categoryQuestions = await getQuestionsByCategory(categoryId);
        const currentIndex = categoryQuestions.findIndex((q) => q.id === questionId);

        if (currentIndex !== -1 && currentIndex < categoryQuestions.length - 1) {
          setNextQuestion(categoryQuestions[currentIndex + 1]);
        }
      }
    } catch (err) {
      console.error("Error loading result data:", err);
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
        <LoadingText>⏳ Загрузка результатов...</LoadingText>
      </Container>
    );
  }

  if (error || !question) {
    return (
      <Container>
        <ResultBox>
          <ErrorText>{error || "Ошибка загрузки"}</ErrorText>
        </ResultBox>
        <div style={{ textAlign: "center" }}>
          <BackButton onClick={() => navigate("/")}>← Назад к категориям</BackButton>
        </div>
      </Container>
    );
  }

  const totalVotes = (question.votesOptionA || 0) + (question.votesOptionB || 0);
  const percentageA =
    totalVotes > 0 ? Math.round((question.votesOptionA / totalVotes) * 100) : 0;
  const percentageB = totalVotes > 0 ? 100 - percentageA : 0;

  const isMajorityA = percentageA >= 50;

  return (
    <Container>
      <ResultBox>
        <Title>📊 Результаты голосования</Title>

        <VoteResult>
          <OptionLabel>
            <OptionName>🔴 {question.optionA}</OptionName>
            <PercentText>{percentageA}%</PercentText>
          </OptionLabel>
          <ProgressBar>
            <ProgressFill $isA={true} style={{ width: `${percentageA}%` }}>
              {percentageA > 10 && `${percentageA}%`}
            </ProgressFill>
          </ProgressBar>
          <VoteCount>{question.votesOptionA || 0} голосов</VoteCount>
        </VoteResult>

        <VoteResult>
          <OptionLabel>
            <OptionName>🔵 {question.optionB}</OptionName>
            <PercentText>{percentageB}%</PercentText>
          </OptionLabel>
          <ProgressBar>
            <ProgressFill $isA={false} style={{ width: `${percentageB}%` }}>
              {percentageB > 10 && `${percentageB}%`}
            </ProgressFill>
          </ProgressBar>
          <VoteCount>{question.votesOptionB || 0} голосов</VoteCount>
        </VoteResult>

        <ExplanationSection>
          <ExplanationTitle>
            {isMajorityA
              ? "✅ Почему большинство выбирает первый вариант?"
              : "✅ Почему большинство выбирает второй вариант?"}
          </ExplanationTitle>
          <ExplanationText>
            {isMajorityA ? question.majorityReason : question.minorityReason}
          </ExplanationText>
        </ExplanationSection>

        <ExplanationSection>
          <ExplanationTitle>
            {!isMajorityA
              ? "🤔 Почему часть людей выбирает первый вариант?"
              : "🤔 Почему часть людей выбирает второй вариант?"}
          </ExplanationTitle>
          <ExplanationText>
            {!isMajorityA ? question.majorityReason : question.minorityReason}
          </ExplanationText>
        </ExplanationSection>

        <ButtonGroup>
          <BackButton onClick={() => navigate("/")}>← На главную</BackButton>
          <ContinueButton onClick={handleNextQuestion}>
            {nextQuestion ? "Следующий вопрос →" : "Вернуться к вопросам →"}
          </ContinueButton>
        </ButtonGroup>
      </ResultBox>
    </Container>
  );
}

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
`;

const ResultBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;

  @media (max-width: 640px) {
    padding: 20px;
  }
`;

const Title = styled.h2`
  color: #333;
  font-size: 24px;
  margin: 0 0 30px 0;
  text-align: center;

  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

const VoteResult = styled.div`
  margin-bottom: 30px;

  &:last-of-type {
    margin-bottom: 30px;
  }
`;

const OptionLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
`;

const OptionName = styled.span`
  font-size: 16px;
`;

const PercentText = styled.span`
  font-size: 14px;
  color: #667eea;
  font-weight: 700;
`;

const ProgressBar = styled.div`
  background: #e0e0e0;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${(props) => (props.$isA ? "#ff6b6b" : "#4ecdc4")};
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 12px;
`;

const VoteCount = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #999;
`;

const ExplanationSection = styled.div`
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-top: 15px;
  border-left: 4px solid #667eea;

  &:first-of-type {
    margin-top: 30px;
  }
`;

const ExplanationTitle = styled.h4`
  color: #333;
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 700;
`;

const ExplanationText = styled.p`
  color: #666;
  margin: 0;
  line-height: 1.6;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 30px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ContinueButton = styled(Button)`
  background: #667eea;
  color: white;

  &:hover:not(:disabled) {
    background: #5568d3;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const BackButton = styled(Button)`
  background: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background: #5a6268;
  }
`;

const LoadingText = styled.div`
  color: white;
  text-align: center;
  font-size: 18px;
`;

const ErrorText = styled.div`
  color: #ff6b6b;
  text-align: center;
  font-size: 16px;
  background: white;
  padding: 20px;
  border-radius: 8px;
`;
