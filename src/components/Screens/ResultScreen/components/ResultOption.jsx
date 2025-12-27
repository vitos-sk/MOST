/**
 * ResultOption Component
 * Отображает вариант ответа с прогресс-баром и статусом
 */

import styled from "styled-components";
import { theme } from "../../../../theme/theme";
import { ProgressBar } from "./ProgressBar";

export function ResultOption({
  optionKey,
  optionText,
  percentage,
  voteCount,
  isUserChoice,
  isCorrectOption,
}) {
  return (
    <StatisticsBlock>
      <OptionLabel>
        <OptionName>
          Вариант {optionKey}: {optionText}
          {isCorrectOption && <CorrectBadge>✓ Правильный ответ</CorrectBadge>}
          {isUserChoice && !isCorrectOption && <WrongBadge>✗ Ваш ответ</WrongBadge>}
        </OptionName>
        <PercentageLabel>{percentage}%</PercentageLabel>
      </OptionLabel>
      <ProgressBar
        percentage={percentage}
        option={optionKey}
        isCorrect={isCorrectOption}
        isUserChoice={isUserChoice && !isCorrectOption}
      />
      <VoteCount>{voteCount}</VoteCount>
    </StatisticsBlock>
  );
}

const StatisticsBlock = styled.div`
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

const PercentageLabel = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.accent.primary};
  font-weight: ${theme.typography.weights.medium};
`;

const VoteCount = styled.div`
  margin-top: ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.tertiary};
  font-weight: ${theme.typography.weights.medium};
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
