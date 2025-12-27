import styled from "styled-components";
import { Button, CodeHighlight } from "../../../UI-components";
import { theme, cardGlass } from "../../../../theme/theme";

export function QuestionCard({ question, categories, onDelete, loading }) {
  const {
    id,
    code,
    optionA,
    optionB,
    optionC,
    category,
    votesOptionA,
    votesOptionB,
    votesOptionC,
  } = question;

  // Get category name from categories array
  const categoryName = categories.find((c) => c.id === category)?.name || category;

  return (
    <ItemCard>
      <ItemHeader>
        <Badge>{categoryName}</Badge>
      </ItemHeader>

      <CodeBlock>
        <CodeLabel>
          <CodeIcon>📝</CodeIcon>
          Код
        </CodeLabel>
        <CodeHighlight code={code} language="javascript" />
      </CodeBlock>

      <ContentBlock>
        <p>
          <strong>Вариант A:</strong> {optionA} ({votesOptionA || 0} голосов)
        </p>
        <p>
          <strong>Вариант B:</strong> {optionB} ({votesOptionB || 0} голосов)
        </p>
        <p>
          <strong>Вариант C:</strong> {optionC} ({votesOptionC || 0} голосов)
        </p>
      </ContentBlock>

      <ButtonDelete onClick={() => onDelete(id)} disabled={loading}>
        Удалить
      </ButtonDelete>
    </ItemCard>
  );
}

const ItemCard = styled.div`
  ${cardGlass}
  border: 1px solid ${theme.colors.border.default};
  border-radius: 0;
  padding: ${theme.spacing.lg};
  box-shadow: none;
  transition: all ${theme.transition.base};
  background: ${theme.colors.bg.card};

  &:hover {
    box-shadow: none;
    border-color: ${theme.colors.border.accent};
    transform: translateY(-2px);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

const CodeBlock = styled.div`
  ${cardGlass}
  border-radius: 0;
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  border: 2px solid ${theme.colors.border.default};
  background: ${theme.colors.bg.card};
  box-shadow: none;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${theme.colors.accent.primary};
    opacity: 0.5;
  }
`;

const CodeLabel = styled.div`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  letter-spacing: -0.01em;
`;

const CodeIcon = styled.span`
  font-size: ${theme.typography.sizes.md};
  filter: grayscale(0.2);
`;

const Badge = styled.span`
  background: ${theme.colors.accent.primary};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: 0;
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.semibold};
  box-shadow: none;
`;

const ContentBlock = styled.div`
  ${cardGlass}
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: 0;
  margin-bottom: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.bg.glass};

  p {
    margin: ${theme.spacing.sm} 0;
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.sizes.sm};

    strong {
      font-weight: ${theme.typography.weights.semibold};
      color: ${theme.colors.accent.primary};
    }
  }
`;

const ButtonDelete = styled(Button)`
  background: rgba(239, 68, 68, 0.2);
  color: ${theme.colors.status.error};
  border: 1px solid rgba(239, 68, 68, 0.4);

  &:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.3);
    border-color: rgba(239, 68, 68, 0.6);
  }
`;
