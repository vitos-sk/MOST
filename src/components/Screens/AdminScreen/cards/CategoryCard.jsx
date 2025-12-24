import styled from "styled-components";
import { Button } from "../../../UI-components";
import { CategoryIcon } from "../../../UI-components/CategoryIcon/CategoryIcon";
import { theme, cardGlass } from "../../../../theme/theme";

export function CategoryCard({ category, onDelete, loading }) {
  const { id, emoji, name } = category;

  return (
    <ItemCard>
      <ItemHeader>
        <ItemTitleWrapper>
          <CategoryIcon emoji={emoji} size="sm" />
          <ItemTitle>{name}</ItemTitle>
        </ItemTitleWrapper>
        <Badge $color="#6c757d">{id}</Badge>
      </ItemHeader>

      <ButtonGroup>
        <ButtonDelete onClick={() => onDelete(id)} disabled={loading}>
          Удалить
        </ButtonDelete>
      </ButtonGroup>
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
  position: relative;
  z-index: 1;

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
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

const ItemTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  flex: 1;
`;

const ItemTitle = styled.h3`
  margin: 0;
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
  flex: 1;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes.xl};
  }
`;

const Badge = styled.span`
  background: ${theme.colors.bg.glass};
  color: ${theme.colors.text.secondary};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.radius.full};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};
  border: 1px solid ${theme.colors.border.default};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
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
