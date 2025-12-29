/**
 * QuestionCodeBlock Component
 * Отображает блок с кодом вопроса в QuestionScreen
 */

import styled from "styled-components";
import { CodeHighlight } from "../../../UI-components";
import { theme, cardGlass } from "../../../../theme/theme";

export function QuestionCodeBlock({ code }) {
  return (
    <Container>
      <CodeLabel>Код</CodeLabel>
      <CodeHighlight code={code} language="javascript" />
    </Container>
  );
}

const Container = styled.div`
  ${cardGlass}
  border-radius: 0;
  padding: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.sm};
  background: ${theme.colors.bg.secondary};
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 310px;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.sm}) {
    max-height: 390px;
  }
`;

const CodeLabel = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};
  margin-bottom: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
`;
