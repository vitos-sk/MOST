import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { theme, cardGlass } from "../../../theme/theme";

export function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess?.();
    } catch (err) {
      setError("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Title>Вход в админ-панель</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Логин (Email)</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              disabled={loading}
            />
          </InputGroup>
          <InputGroup>
            <Label>Пароль</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
              disabled={loading}
            />
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </SubmitButton>
        </Form>
      </LoginCard>
      <FixedBackButton onClick={() => navigate("/")} aria-label="На главную">
        <BackIcon>‹</BackIcon>
      </FixedBackButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  padding: ${theme.spacing.lg};
`;

const LoginCard = styled.div`
  ${cardGlass}
  width: 100%;
  max-width: 400px;
  padding: ${theme.spacing.xl};
  border-radius: 0;
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.bg.glass};
  box-shadow: none;
`;

const Title = styled.h1`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin: 0 0 ${theme.spacing.xl} 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.secondary};
`;

const Input = styled.input`
  padding: ${theme.spacing.md};
  border: none;
  border-radius: 0;
  background: ${theme.colors.bg.card};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.sizes.base};
  transition: all ${theme.transition.base};

  &:focus {
    outline: none;
    background: ${theme.colors.bg.secondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  padding: ${theme.spacing.md};
  background: ${theme.colors.status.error}20;
  color: ${theme.colors.status.error};
  border-radius: 0;
  font-size: ${theme.typography.sizes.sm};
  text-align: center;
`;

const SubmitButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  min-height: 40px;
  background: ${theme.colors.accent.primary};
  color: ${theme.colors.text.primary};
  border: none;
  border-radius: 0;
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  font-family: ${theme.typography.fontFamily};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition: all ${theme.transition.base};
  margin-top: ${theme.spacing.sm};
  box-shadow: none;

  &:hover:not(:disabled) {
    background: ${theme.colors.accent.primaryHover};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const FixedBackButton = styled.button`
  ${cardGlass}
  position: fixed;
  bottom: ${theme.spacing.md};
  left: ${theme.spacing.md};
  width: 56px;
  height: 56px;
  border-radius: 0;
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
  box-shadow: none;

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
      box-shadow: none;
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
