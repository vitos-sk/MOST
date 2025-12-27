/**
 * ProgressBar Component
 * Отображает прогресс-бар с анимацией заполнения
 */

import styled from "styled-components";
import { theme } from "../../../../theme/theme";

export function ProgressBar({ percentage, option, isCorrect, isUserChoice }) {
  return (
    <ProgressBarContainer>
      <ProgressFill
        $option={option}
        $width={percentage}
        $isCorrect={isCorrect}
        $isUserChoice={isUserChoice}
      >
        {percentage > 10 && `${percentage}%`}
      </ProgressFill>
    </ProgressBarContainer>
  );
}

const ProgressBarContainer = styled.div`
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
