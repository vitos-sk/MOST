import { useRef } from "react";
import styled from "styled-components";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { theme } from "../../../theme/theme";

const BoxHeader = ({ className }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Скрытый доступ к админ-панели: долгое нажатие на заголовок (2 секунды)
  const longPressTimerRef = useRef(null);

  const handleTitleLongPress = () => {
    navigate("/admin");
  };

  const startLongPress = () => {
    longPressTimerRef.current = setTimeout(() => {
      handleTitleLongPress();
      longPressTimerRef.current = null;
    }, 2000);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <div className={className}>
      <HeaderContent>
        <TitleWrapper>
          <Title
            onTouchStart={startLongPress}
            onTouchEnd={cancelLongPress}
            onTouchCancel={cancelLongPress}
            onMouseDown={startLongPress}
            onMouseUp={cancelLongPress}
            onMouseLeave={cancelLongPress}
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            JS Reality Test
          </Title>
        </TitleWrapper>

        {user && (
          <UserInfo>
            <UserText>
              {user.firstName} {user.lastName}
              {user.isMock && <MockBadge>тест</MockBadge>}
            </UserText>
          </UserInfo>
        )}
      </HeaderContent>
    </div>
  );
};

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  width: 100%;

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing.xs};
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  min-width: 0;
`;

const Title = styled.h1`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  margin: 0;
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeights.tight};
  letter-spacing: 0.1em;
  white-space: nowrap;
  text-transform: uppercase;
  position: relative;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes["2xl"]};
    letter-spacing: 0.15em;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  background: ${theme.colors.bg.card};
  border: none;
  border-radius: 0;
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  flex-shrink: 0;
  max-width: 150px;

  @media (max-width: ${theme.breakpoints.sm}) {
    max-width: 120px;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.typography.sizes.xs};
  }
`;

const UserText = styled.span`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-weight: ${theme.typography.weights.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MockBadge = styled.span`
  padding: 2px ${theme.spacing.xs};
  background: ${theme.colors.status.warning}30;
  color: ${theme.colors.status.warning};
  border-radius: 0;
  font-size: 9px;
  font-weight: ${theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
`;

export const Header = styled(BoxHeader)`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  transition: all ${theme.transition.base};
  position: relative;
  border: none;
  background: transparent;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
  }
`;
