import styled from "styled-components";
import { theme } from "../../../theme/theme";

// ===== КОМПОНЕНТ SELECT =====
export const Select = ({ label, error, options = [], noMargin = false, ...props }) => {
  return (
    <SelectWrapper $noMargin={noMargin}>
      {label && <StyledLabel>{label}</StyledLabel>}
      <StyledSelect $error={error} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      {error && <ErrorText>{error}</ErrorText>}
    </SelectWrapper>
  );
};

// ===== SELECT =====
const StyledSelect = styled.select`
  width: 100%;
  background: ${theme.colors.bg.card};
  border: 1px solid
    ${(props) => (props.$error ? theme.colors.status.error : theme.colors.border.default)};
  border-radius: 0;
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.sizes.base};
  font-family: ${theme.typography.fontFamily};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  touch-action: manipulation;
  transition: all ${theme.transition.base};

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

// ===== SELECT WRAPPER =====
const SelectWrapper = styled.div`
  margin-bottom: ${(props) => (props.$noMargin ? "0" : theme.spacing.lg)};
`;
