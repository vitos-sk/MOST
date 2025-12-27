import styled from "styled-components";
import { theme, cardGlass } from "../../../theme/theme";

export const Button = ({
  children,
  variant = "default",
  size = "medium",
  fullWidth = false,
  icon,
  ...props
}) => {
  return (
    <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} {...props}>
      {icon && <span>{icon}</span>}
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  background: ${(props) => {
    if (props.$variant === "primary") return theme.colors.accent.primary;
    if (props.$variant === "secondary") return theme.colors.bg.card;
    if (props.$variant === "outline") return "transparent";
    if (props.$variant === "ghost") return "transparent";
    return theme.colors.bg.card;
  }};

  color: ${(props) => {
    if (props.$variant === "primary") return theme.colors.text.primary;
    if (props.$variant === "secondary") return theme.colors.text.primary;
    if (props.$variant === "outline") return theme.colors.accent.primary;
    if (props.$variant === "ghost") return theme.colors.accent.primary;
    return theme.colors.text.primary;
  }};

  border: none;

  /* Компактные размеры */
  padding: ${(props) => {
    if (props.$size === "small") return `${theme.spacing.sm} ${theme.spacing.md}`;
    if (props.$size === "large") return `${theme.spacing.md} ${theme.spacing.lg}`;
    return `${theme.spacing.sm} ${theme.spacing.lg}`;
  }};
  min-height: 40px;
  min-width: auto;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: ${(props) => {
      if (props.$size === "small") return `${theme.spacing.xs} ${theme.spacing.sm}`;
      if (props.$size === "large") return `${theme.spacing.md} ${theme.spacing.xl}`;
      return `${theme.spacing.sm} ${theme.spacing.lg}`;
    }};
    min-height: 36px;
  }

  font-size: ${theme.typography.sizes.base};
  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${(props) => {
      if (props.$size === "small") return theme.typography.sizes.sm;
      if (props.$size === "large") return theme.typography.sizes.md;
      return theme.typography.sizes.base;
    }};
  }

  border-radius: 0;
  font-weight: ${theme.typography.weights.semibold};
  font-family: ${theme.typography.fontFamily};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition: all ${theme.transition.base};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  box-shadow: none;
  position: relative;

  /* Для мобильных: активное состояние вместо hover */
  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: none;
    }
  }

  &:hover:not(:disabled) {
    ${(props) => {
      if (props.$variant === "primary") {
        return `
          background: ${theme.colors.accent.primaryHover};
        `;
      }
      if (props.$variant === "secondary") {
        return `
          background: ${theme.colors.bg.cardHover};
        `;
      }
      if (props.$variant === "outline") {
        return `
          background: ${theme.colors.bg.secondary};
        `;
      }
      if (props.$variant === "ghost") {
        return `
          background: ${theme.colors.bg.secondary};
        `;
      }
      return `
        background: ${theme.colors.bg.cardHover};
      `;
    }}
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  ${(props) => props.$fullWidth && "width: 100%;"}
`;
