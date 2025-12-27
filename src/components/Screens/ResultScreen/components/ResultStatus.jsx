/**
 * ResultStatus Component
 * Отображает статус правильности ответа
 */

import styled from "styled-components";
import { theme, cardGlass } from "../../../../theme/theme";

export function ResultStatus({ isCorrect }) {
  return (
    <StatusContainer $isCorrect={isCorrect}>
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
    </StatusContainer>
  );
}

const StatusContainer = styled.div`
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
