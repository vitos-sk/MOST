import {
  ItemCard,
  ItemHeader,
  ItemTitle,
  Badge,
  ButtonGroup,
  ButtonDelete,
} from "../../../styles/admin.styles";

export default function CategoryCard({ category, onDelete, loading }) {
  const { id, emoji, name } = category;

  return (
    <ItemCard>
      <ItemHeader>
        <ItemTitle>
          {emoji} {name}
        </ItemTitle>
        <Badge $color="#6c757d">{id}</Badge>
      </ItemHeader>

      <ButtonGroup>
        <ButtonDelete onClick={() => onDelete(id)} disabled={loading}>
          🗑️ Удалить
        </ButtonDelete>
      </ButtonGroup>
    </ItemCard>
  );
}
