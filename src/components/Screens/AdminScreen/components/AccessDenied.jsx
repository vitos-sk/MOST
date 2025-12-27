/**
 * AccessDenied Component
 * Экран "Доступ запрещен"
 */

import styled from "styled-components";
import { theme, cardGlass } from "../../../../theme/theme";

export function AccessDenied({ onLogout }) {
  return (
    <Container>
      <AccessDeniedBox>
        <AccessDeniedTitle>🚫 Доступ запрещён</AccessDeniedTitle>
        <AccessDeniedText>
          У вас нет прав доступа к админ-панели. Обратитесь к администратору.
        </AccessDeniedText>
        <LogoutButton onClick={onLogout}>Выйти</LogoutButton>
      </AccessDeniedBox>
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

const AccessDeniedBox = styled.div`
  ${cardGlass}
  border-radius: 0;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  text-align: center;
  box-shadow: none;
  border: 1px solid ${theme.colors.border.default};
  max-width: 500px;
  margin: 0 auto;
  background: ${theme.colors.bg.card};
`;

const AccessDeniedTitle = styled.h2`
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: ${theme.typography.sizes.xl};
  color: ${theme.colors.status.error};
  font-weight: ${theme.typography.weights.bold};

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes["2xl"]};
  }
`;

const AccessDeniedText = styled.p`
  margin: 0 0 ${theme.spacing.xl} 0;
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeights.relaxed};
`;

const LogoutButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.status.error};
  color: ${theme.colors.text.primary};
  border: none;
  border-radius: 0;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.semibold};
  font-family: ${theme.typography.fontFamily};
  transition: all ${theme.transition.base};
  min-height: 40px;

  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
    box-shadow: none;
  }

  &:active {
    transform: translateY(0);
  }
`;
