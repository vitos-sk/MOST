import styled from "styled-components";
import { theme } from "../../../theme/theme";

// ===== КОМПОНЕНТ TEXTAREA =====
export const Textarea = ({ label, error, minHeight, noMargin = false, ...props }) => {
  return (
    <TextareaWrapper $noMargin={noMargin}>
      {label && <StyledLabel>{label}</StyledLabel>}
      <StyledTextarea $minHeight={minHeight} $error={error} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </TextareaWrapper>
  );
};

// ===== TEXTAREA =====
const StyledTextarea = styled.textarea`
  width: 100%;
  background: ${theme.colors.bg.card};
  border: 1px solid
    ${(props) => (props.$error ? theme.colors.status.error : theme.colors.border.default)};
  border-radius: ${theme.radius.md};
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.sizes.base};
  font-family: ${theme.typography.fontFamily};
  color: ${theme.colors.text.primary};
  resize: vertical;
  min-height: ${(props) => props.$minHeight || "100px"};
  transition: all ${theme.transition.base};
  line-height: ${theme.typography.lineHeights.normal};

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

// ===== LABEL =====
const StyledLabel = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.xs};
  font-weight: ${theme.typography.weights.semibold};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
`;

// ===== ERROR TEXT =====
const ErrorText = styled.span`
  display: block;
  margin-top: ${theme.spacing.xs};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.status.error};
`;

// ===== TEXTAREA WRAPPER =====
const TextareaWrapper = styled.div`
  margin-bottom: ${(props) => (props.$noMargin ? "0" : theme.spacing.lg)};
`;
