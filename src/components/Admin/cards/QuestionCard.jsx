import {
  ItemCard,
  ItemHeader,
  ItemTitle,
  Badge,
  ContentBlock,
  ExplanationBlock,
  ButtonDelete,
} from "../../../styles/admin.styles";
import { getCategoryName } from "../../../services/adminUtils";

export default function QuestionCard({ question, categories, onDelete, loading }) {
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
          🔴 <strong>{optionA}</strong> ({votesOptionA || 0} голосов)
        </p>
        <p>
          🔵 <strong>{optionB}</strong> ({votesOptionB || 0} голосов)
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
        🗑️ Удалить
      </ButtonDelete>
    </ItemCard>
  );
}
