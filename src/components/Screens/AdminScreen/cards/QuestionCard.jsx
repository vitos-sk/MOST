import styled from "styled-components";
import { getCategoryName } from "../../../../API";
import { Button } from "../../../UI-components";
import { theme, cardGlass } from "../../../../theme/theme";

export function QuestionCard({ question, categories, onDelete, loading }) {
  const {
    id,
    text,
    optionA,
    optionB,
    majorityReason,
    minorityReason,
    category,
    votesOptionA,
    votesOptionB,
  } = question;

  return (
    <ItemCard>
      <ItemHeader>
        <ItemTitle>{text}</ItemTitle>
        <Badge>{getCategoryName(category, categories)}</Badge>
      </ItemHeader>

      <ContentBlock>
        <p>
          <strong>Вариант A:</strong> {optionA} ({votesOptionA || 0} голосов)
        </p>
        <p>
          <strong>Вариант B:</strong> {optionB} ({votesOptionB || 0} голосов)
        </p>
      </ContentBlock>

      <ExplanationBlock>
        <p>
          <strong>Большинство:</strong> {majorityReason}
        </p>
        <p>
          <strong>Меньшинство:</strong> {minorityReason}
        </p>
      </ExplanationBlock>

      <ButtonDelete onClick={() => onDelete(id)} disabled={loading}>
        Удалить
      </ButtonDelete>
    </ItemCard>
  );
}

const ItemCard = styled.div`
  ${cardGlass}
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadow.md};
  transition: all ${theme.transition.base};
  background: ${theme.colors.bg.card};

  &:hover {
    box-shadow: ${theme.shadow.lg};
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

const ItemTitle = styled.h3`
  margin: 0;
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
  flex: 1;
  line-height: ${theme.typography.lineHeights.normal};

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes.xl};
  }
`;

const Badge = styled.span`
  background: ${theme.colors.accent.gradient};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.radius.full};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.semibold};
  box-shadow: ${theme.shadow.sm};
`;

const ContentBlock = styled.div`
  ${cardGlass}
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
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

const ExplanationBlock = styled.div`
  ${cardGlass}
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  margin-bottom: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.accent.gradientSoft};

  p {
    margin: ${theme.spacing.sm} 0;
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.sizes.sm};
    line-height: ${theme.typography.lineHeights.relaxed};

    strong {
      font-weight: ${theme.typography.weights.bold};
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
