import styled from "styled-components";
import { theme } from "../../../theme/theme";

const Button = styled.button`
  position: fixed;
  bottom: ${theme.spacing.md};
  right: ${theme.spacing.md};
  width: 36px;
  height: 36px;
  border-radius: 0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition: all ${theme.transition.base};
  padding: 0;
  background: ${theme.colors.bg.card};
  z-index: ${theme.zIndex.sticky};

  &:active {
    background: ${theme.colors.bg.cardHover};
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    &:hover {
      background: ${theme.colors.bg.cardHover};
    }
  }
`;

const BackIcon = styled.span`
  font-size: ${theme.typography.sizes["2xl"]};
  color: ${theme.colors.text.primary};
  line-height: 1;
  font-weight: ${theme.typography.weights.bold};
`;

export function BackButton({ onClick, ...props }) {
  return (
    <Button onClick={onClick} aria-label="Назад" {...props}>
      <BackIcon>‹</BackIcon>
    </Button>
  );
}
