import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCategories } from "../../../hooks";
import { theme, cardGlass } from "../../../theme/theme";
import { CategoryIcon } from "../../UI-components/CategoryIcon/CategoryIcon";
import { Header } from "../../UI-components/Header/Header";
import { routeHelpers } from "../../../config/routes";

export function CategoriesScreen() {
  const { categories, loading } = useCategories();
  const navigate = useNavigate();

  const handleCategorySelect = (categoryId) => {
    navigate(routeHelpers.questions(categoryId));
  };

  if (loading) {
    return (
      <Container>
        <LoadingWrapper>
          <LoadingTitle>MOST</LoadingTitle>
          <LoadingText>Загрузка категорий...</LoadingText>
          <LoadingSpinner />
        </LoadingWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <ContentWrapper>
        <CategoriesGrid>
          {categories.map((cat, index) => (
            <CategoryCard
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              $delay={index * 80}
            >
              <CategoryCardInner>
                <CategoryIconWrapper>
                  <CategoryIcon emoji={cat.emoji} size="lg" />
                </CategoryIconWrapper>
                <CategoryContent>
                  <CategoryName>{cat.name}</CategoryName>
                  <CategoryArrow>›</CategoryArrow>
                </CategoryContent>
              </CategoryCardInner>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: ${theme.spacing.sm};
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto;

  @media (max-width: ${theme.breakpoints.sm}) {
    height: 100dvh;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 700px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.xxl} ${theme.spacing.md};
`;

const LoadingTitle = styled.div`
  font-size: 64px;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }
`;

const LoadingText = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.medium};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.border.default};
  border-top-color: ${theme.colors.accent.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xxl};

  @media (min-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.lg};
  }

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.lg};
  }
`;

const CategoryCardInner = styled.div`
  padding: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  position: relative;
  z-index: 1;
  transition: background ${theme.transition.base};
  min-height: 60px;
`;

const CategoryArrow = styled.span`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.accent.primary};
  font-weight: ${theme.typography.weights.semibold};
  transition: all ${theme.transition.base};
  opacity: 0.7;
  flex-shrink: 0;
`;

export const CategoryCard = styled.button`
  ${cardGlass}
  border-radius: 0;
  padding: 0;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition: all ${theme.transition.base};
  border: none;
  box-shadow: none;
  animation: cardAppear 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation-delay: ${(props) => props.$delay || 0}ms;
  animation-fill-mode: both;
  position: relative;
  overflow: hidden;
  background: ${theme.colors.bg.card};

  @keyframes cardAppear {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  &:active {
    background: ${theme.colors.bg.cardHover};
    transition: all ${theme.transition.fast};
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    &:hover {
      background: ${theme.colors.bg.cardHover};

      ${CategoryArrow} {
        transform: translateX(4px);
        opacity: 1;
      }
    }
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent.primary};
    outline-offset: 2px;
  }
`;

const CategoryIconWrapper = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.bg.secondary};
  border-radius: 0;
  box-shadow: none;
  position: relative;
  z-index: 2;
  transition: all ${theme.transition.base};
  padding: ${theme.spacing.sm};

  svg {
    filter: none;
  }
`;

const CategoryContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  position: relative;
  z-index: 2;
`;

const CategoryName = styled.span`
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeights.tight};
  letter-spacing: -0.01em;
`;
