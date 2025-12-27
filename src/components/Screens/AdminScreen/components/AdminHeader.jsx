/**
 * AdminHeader Component
 * Заголовок админ-панели с кнопкой выхода
 */

import styled from "styled-components";
import { theme, cardGlass } from "../../../../theme/theme";

export function AdminHeader({ onLogout }) {
  return (
    <Header>
      <HeaderTitle>Админ-панель</HeaderTitle>
      <LogoutButton onClick={onLogout}>Выйти</LogoutButton>
    </Header>
  );
}

const Header = styled.div`
  ${cardGlass}
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: 0;
  border: 1px solid ${theme.colors.border.default};
  box-shadow: none;
  background: ${theme.colors.bg.card};

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${theme.spacing.md};
    align-items: stretch;
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: ${theme.typography.sizes.xl};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.weights.bold};

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes["2xl"]};
  }
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

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
  }
`;
