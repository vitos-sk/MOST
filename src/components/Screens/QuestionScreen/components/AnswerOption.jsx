/**
 * AnswerOption Component
 * Отображает вариант ответа в QuestionScreen
 */

import styled from "styled-components";
import { theme, cardGlass } from "../../../../theme/theme";

export function AnswerOption({
  optionKey,
  optionText,
  voteCount,
  isSelected,
  onClick,
  disabled,
}) {
  return (
    <AnswerButton $selected={isSelected} onClick={onClick} disabled={disabled}>
      <OptionContent>
        <OptionIcon>{optionKey}</OptionIcon>
        <OptionText>{optionText}</OptionText>
      </OptionContent>
      <VoteCount>{voteCount}</VoteCount>
    </AnswerButton>
  );
}

const AnswerButton = styled.button`
  ${cardGlass}
  border: none;
  border-radius: 0;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  min-height: 50px;
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
  gap: ${theme.spacing.xs};
  position: relative;
  overflow: hidden;
  background: ${(props) =>
    props.$selected ? theme.colors.bg.secondary : theme.colors.bg.card};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: ${theme.colors.accent.primary};
    opacity: ${(props) => (props.$selected ? 1 : 0)};
    transition: opacity ${theme.transition.base};
    z-index: 2;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  &:active:not(:disabled) {
    background: ${theme.colors.bg.secondary};
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    &:hover:not(:disabled) {
      background: ${theme.colors.bg.secondary};
    }

    &:active:not(:disabled) {
      background: ${theme.colors.bg.secondary};
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
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.bg.secondary};
  border: none;
  border-radius: 0;
  flex-shrink: 0;
`;

const OptionText = styled.div`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeights.tight};
`;

const VoteCount = styled.div`
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.text.tertiary};
  font-weight: ${theme.typography.weights.normal};
  white-space: nowrap;
  opacity: 0.6;
`;
