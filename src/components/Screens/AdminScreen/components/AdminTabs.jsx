/**
 * AdminTabs Component
 * Табы для переключения между вопросами и категориями
 */

import styled from "styled-components";
import { theme, cardGlass } from "../../../../theme/theme";

export function AdminTabs({ activeTab, onTabChange, children }) {
  return (
    <TabContainer>
      <TabButtons>
        <TabButton
          $active={activeTab === "questions"}
          onClick={() => onTabChange("questions")}
        >
          Вопросы
        </TabButton>
        <TabButton
          $active={activeTab === "categories"}
          onClick={() => onTabChange("categories")}
        >
          Категории
        </TabButton>
      </TabButtons>
      <ContentBlock>{children}</ContentBlock>
    </TabContainer>
  );
}

const TabContainer = styled.div`
  ${cardGlass}
  border-radius: 0;
  padding: ${theme.spacing.lg};
  position: relative;
  z-index: 1;
  box-shadow: none;
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.bg.card};

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md};
  }
`;

const TabButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xl};
  border-bottom: 2px solid ${theme.colors.border.default};
  padding-bottom: ${theme.spacing.xs};
`;

const TabButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border: none;
  background: transparent;
  color: ${(props) =>
    props.$active ? theme.colors.accent.primary : theme.colors.text.tertiary};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${(props) =>
    props.$active ? theme.typography.weights.bold : theme.typography.weights.normal};
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  border-bottom: 3px solid
    ${(props) => (props.$active ? theme.colors.accent.primary : "transparent")};
  transition: all ${theme.transition.base};
  margin-bottom: -2px;
  position: relative;

  &:hover {
    color: ${theme.colors.accent.primary};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    &:active {
      transform: none;
    }
  }
`;

const ContentBlock = styled.div`
  margin-top: ${theme.spacing.md};
`;
