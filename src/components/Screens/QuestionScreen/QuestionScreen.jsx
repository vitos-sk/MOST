import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getUnansweredQuestions, addVote } from "../../../services/firestoreService";
import { useAuth } from "../../../context/AuthContext";

export default function QuestionScreen() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState(null);

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
    try {
      // Используем функцию которая фильтрует уже отвеченные вопросы
      const unansweredQuestions = await getUnansweredQuestions(user.id, categoryId);

      if (unansweredQuestions.length === 0) {
        setError("Вы ответили на все вопросы в этой категории! 🎉");
      } else {
        setQuestions(unansweredQuestions);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
      }
    } catch (err) {
      console.error("Error loading questions:", err);
      setError("Ошибка загрузки вопросов");
    }
    setLoading(false);
  };

  const handleVote = async () => {
    if (!selectedOption) {
      return;
    }

    if (!user?.id) {
      alert("Ошибка: не удалось получить ID пользователя");
      return;
    }

    setVoting(true);
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const userId = user.id;

      // Добавляем голос
      const result = await addVote(userId, currentQuestion.id, selectedOption);

      if (!result.success) {
        alert(result.message || "Ошибка при голосовании");
        setVoting(false);
        return;
      }

      // Переход на экран результатов
      navigate(`/results/${currentQuestion.id}/${categoryId}`);
    } catch (err) {
      console.error("Error voting:", err);
      alert("Ошибка при голосовании");
      setVoting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // Если это последний вопрос, возвращаемся к категориям
      navigate("/");
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
        <LoadingText>⏳ Загрузка вопросов...</LoadingText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <QuestionBox>
          <ErrorText>{error}</ErrorText>
        </QuestionBox>
        <ButtonWrapper>
          <BackButton onClick={() => navigate("/")}>← Назад к категориям</BackButton>
        </ButtonWrapper>
      </Container>
    );
  }

  if (questions.length === 0) {
    return (
      <Container>
        <QuestionBox>
          <SuccessText>
            🎉 Поздравляем! Вы ответили на все вопросы в этой категории!
          </SuccessText>
        </QuestionBox>
        <ButtonWrapper>
          <BackButton onClick={() => navigate("/")}>
            ← Выбрать другую категорию
          </BackButton>
        </ButtonWrapper>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  return (
    <Container>
      <QuestionBox>
        <QuestionNumber>
          Вопрос {currentQuestionIndex + 1} из {totalQuestions}
        </QuestionNumber>

        <QuestionText>{currentQuestion.text}</QuestionText>

        <OptionsContainer>
          <OptionButton
            $selected={selectedOption === "A"}
            onClick={() => setSelectedOption("A")}
            disabled={voting}
          >
            <OptionContent>
              <OptionEmoji>🔴</OptionEmoji>
              <OptionText>{currentQuestion.optionA}</OptionText>
            </OptionContent>
            <VoteCount>{currentQuestion.votesOptionA || 0} голосов</VoteCount>
          </OptionButton>

          <OptionButton
            $selected={selectedOption === "B"}
            onClick={() => setSelectedOption("B")}
            disabled={voting}
          >
            <OptionContent>
              <OptionEmoji>🔵</OptionEmoji>
              <OptionText>{currentQuestion.optionB}</OptionText>
            </OptionContent>
            <VoteCount>{currentQuestion.votesOptionB || 0} голосов</VoteCount>
          </OptionButton>
        </OptionsContainer>

        <ButtonGroup>
          <BackButton onClick={() => navigate("/")} disabled={voting}>
            ← К категориям
          </BackButton>

          {currentQuestionIndex < totalQuestions - 1 && (
            <SkipButton onClick={handleSkipQuestion} disabled={voting}>
              Пропустить
            </SkipButton>
          )}

          <SubmitButton onClick={handleVote} disabled={voting || !selectedOption}>
            {voting ? "⏳ Отправка..." : "💾 Ответить"}
          </SubmitButton>
        </ButtonGroup>
      </QuestionBox>
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

const QuestionBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;

  @media (max-width: 640px) {
    padding: 20px;
  }
`;

const QuestionNumber = styled.p`
  color: #999;
  font-size: 14px;
  margin: 0 0 15px 0;
  font-weight: 600;
`;

const QuestionText = styled.h2`
  color: #333;
  font-size: 24px;
  margin: 0 0 30px 0;
  line-height: 1.4;

  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

const OptionsContainer = styled.div`
  display: grid;
  gap: 15px;
`;

const OptionButton = styled.button`
  background: ${(props) => (props.$selected ? "#667eea" : "#f0f0f0")};
  color: ${(props) => (props.$selected ? "white" : "#333")};
  border: 2px solid ${(props) => (props.$selected ? "#667eea" : "#e0e0e0")};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover:not(:disabled) {
    border-color: #667eea;
    background: ${(props) => (props.$selected ? "#5568d3" : "#f9f9f9")};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const OptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const OptionEmoji = styled.span`
  font-size: 20px;
`;

const OptionText = styled.span`
  font-weight: 600;
  font-size: 16px;
  text-align: left;
`;

const VoteCount = styled.span`
  opacity: 0.7;
  font-weight: 400;
  font-size: 14px;
  white-space: nowrap;
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

const SubmitButton = styled(Button)`
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

const SkipButton = styled(Button)`
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;

  &:hover:not(:disabled) {
    background: #667eea;
    color: white;
  }
`;

const ButtonWrapper = styled.div`
  text-align: center;
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
  padding: 20px;
`;

const SuccessText = styled.div`
  color: #51cf66;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  padding: 20px;
`;
