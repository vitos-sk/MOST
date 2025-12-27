/**
 * LoadingState Component
 * Состояние загрузки для админ-панели
 */

import styled from "styled-components";
import { theme } from "../../../../theme/theme";

export function LoadingState() {
  return (
    <Container>
      <LoadingText>Загрузка...</LoadingText>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: ${theme.spacing.md};
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.lg};
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.weights.medium};
`;
