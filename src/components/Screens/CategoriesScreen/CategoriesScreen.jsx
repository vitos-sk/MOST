import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getCategories } from "../../../API/categories/getCategories";
import { theme, cardGlass } from "../../../theme/theme";
import { CategoryIcon } from "../../UI-components/CategoryIcon/CategoryIcon";
import { Header } from "../../UI-components/Header/Header";

export function CategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    navigate(`/questions/${categoryId}`);
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
                <CategoryGlow />
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
  padding: 0;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-y: auto;

  @media (max-width: ${theme.breakpoints.sm}) {
    height: 100dvh;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 100%;
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

// Объявляем дочерние компоненты перед родительским
const CategoryGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle,
    ${theme.colors.accent.primary}20 0%,
    transparent 70%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  opacity: 0;
  transition: all ${theme.transition.slow};
  pointer-events: none;
  z-index: 0;
`;

const CategoryCardInner = styled.div`
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  position: relative;
  z-index: 1;
  transition: background ${theme.transition.base};
  min-height: 90px;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl} ${theme.spacing.xl};
    min-height: 120px;
  }
`;

const CategoryArrow = styled.span`
  font-size: ${theme.typography.sizes["2xl"]};
  color: ${theme.colors.accent.primary};
  font-weight: ${theme.typography.weights.bold};
  transition: all ${theme.transition.base};
  opacity: 0.7;
  flex-shrink: 0;
`;

export const CategoryCard = styled.button`
  ${cardGlass}
  border-radius: ${theme.radius.xl};
  padding: 0;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition: all ${theme.transition.base};
  border: 1px solid ${theme.colors.border.default};
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

  /* Для мобильных: активное состояние вместо hover */
  &:active {
    transform: scale(0.98);
    border-color: ${theme.colors.border.accentHover};
    transition: all ${theme.transition.fast};
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    &:hover {
      transform: translateY(-4px) scale(1.02);
      border-color: ${theme.colors.border.accentHover};
      box-shadow: none;

      ${CategoryGlow} {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.2);
      }

      ${CategoryArrow} {
        transform: translateX(4px);
        opacity: 1;
      }

      ${CategoryCardInner} {
        background: ${theme.colors.accent.gradientSoft};
      }
    }

    &:active {
      transform: translateY(-2px) scale(1.01);
      transition: all ${theme.transition.fast};
    }
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent.primary};
    outline-offset: 4px;
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    border-radius: ${theme.radius.xl};
  }
`;

const CategoryIconWrapper = styled.div`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.accent.gradientSoft};
  border-radius: ${theme.radius.lg};
  box-shadow: none;
  position: relative;
  z-index: 2;
  transition: all ${theme.transition.base};
  padding: ${theme.spacing.sm};

  ${CategoryCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    box-shadow: none;
    background: ${theme.colors.accent.gradientSoft};
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 80px;
    height: 80px;
    padding: ${theme.spacing.md};
  }

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
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeights.tight};
  letter-spacing: -0.02em;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes["2xl"]};
  }
`;
