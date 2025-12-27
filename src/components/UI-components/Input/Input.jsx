import styled from "styled-components";
import { theme } from "../../../theme/theme";

// ===== КОМПОНЕНТ INPUT =====
export const Input = ({ label, error, size = "medium", noMargin = false, ...props }) => {
  return (
    <InputWrapper $noMargin={noMargin}>
      {label && <StyledLabel>{label}</StyledLabel>}
      <StyledInput $size={size} $error={error} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </InputWrapper>
  );
};

// ===== LABEL =====
const StyledLabel = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.secondary};
`;

// ===== INPUT =====
const StyledInput = styled.input`
  width: 100%;
  background: ${theme.colors.bg.card};
  border: 1px solid
    ${(props) => (props.$error ? theme.colors.status.error : theme.colors.border.default)};
  border-radius: 0;
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.sizes.base};
  font-family: ${theme.typography.fontFamily};
  color: ${theme.colors.text.primary};
  transition: all ${theme.transition.base};

  &::placeholder {
    color: ${theme.colors.text.tertiary};
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.primary};
    box-shadow: 0 0 0 3px ${theme.colors.accent.primary}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${theme.colors.bg.glass};
  }

  ${(props) =>
    props.$error &&
    `
    border-color: ${theme.colors.status.error};
    &:focus {
      box-shadow: 0 0 0 3px ${theme.colors.status.error}20;
    }
  `}
`;

// ===== ERROR TEXT =====
const ErrorText = styled.span`
  display: block;
  margin-top: ${theme.spacing.xs};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.status.error};
`;

// ===== INPUT WRAPPER =====
const InputWrapper = styled.div`
  margin-bottom: ${(props) => (props.$noMargin ? "0" : theme.spacing.lg)};
`;
