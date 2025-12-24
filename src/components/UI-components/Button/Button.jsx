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
    if (props.$variant === "primary") return theme.colors.accent.gradient;
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

  border: ${(props) => {
    if (props.$variant === "primary") return "2px solid transparent";
    if (props.$variant === "outline") return `2px solid ${theme.colors.border.accent}`;
    if (props.$variant === "secondary") return `1px solid ${theme.colors.border.default}`;
    if (props.$variant === "ghost") return "2px solid transparent";
    return `1px solid ${theme.colors.border.default}`;
  }};

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

  border-radius: ${theme.radius.md};
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
  box-shadow: ${(props) => {
    if (props.$variant === "ghost") return "none";
    if (props.$variant === "primary") return theme.shadow.glow;
    return theme.shadow.sm;
  }};
  position: relative;
  overflow: hidden;

  ${(props) => props.$variant === "secondary" && cardGlass}

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${theme.colors.accent.gradientSoft};
    opacity: 0;
    transition: opacity ${theme.transition.base};
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

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
      box-shadow: ${theme.shadow.sm};
    }
  }

  &:hover:not(:disabled) {
    ${(props) => {
      if (props.$variant === "primary") {
        return `
          box-shadow: ${theme.shadow.glowStrong};
          filter: brightness(1.1);
        `;
      }
      if (props.$variant === "secondary") {
        return `
          background: ${theme.colors.bg.cardHover};
          border-color: ${theme.colors.border.hover};
          box-shadow: ${theme.shadow.md};
        `;
      }
      if (props.$variant === "outline") {
        return `
          background: ${theme.colors.accent.gradientSoft};
          border-color: ${theme.colors.border.accentHover};
          box-shadow: ${theme.shadow.sm};
        `;
      }
      if (props.$variant === "ghost") {
        return `
          background: ${theme.colors.bg.glassHover};
        `;
      }
      return `
        background: ${theme.colors.bg.cardHover};
        border-color: ${theme.colors.border.hover};
        box-shadow: ${theme.shadow.md};
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
