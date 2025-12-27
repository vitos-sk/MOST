import { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { theme, cardGlass } from "../../../theme/theme";
import { Button } from "../Button/Button";

export function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return createPortal(
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalIcon $type={type}>
            {type === "success" && "✓"}
            {type === "error" && "✕"}
            {type === "warning" && "⚠"}
            {type === "confirm" && "?"}
            {type === "info" && "ℹ"}
          </ModalIcon>
          {title && <ModalTitle>{title}</ModalTitle>}
        </ModalHeader>

        <ModalContent>
          <ModalMessage>{message}</ModalMessage>
        </ModalContent>

        <ModalFooter>
          {type === "confirm" ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  if (onCancel) {
                    onCancel();
                  } else {
                    onClose();
                  }
                }}
              >
                Отмена
              </Button>
              <Button variant="primary" onClick={handleConfirm}>
                {confirmText || "Подтвердить"}
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={onClose} fullWidth>
              ОК
            </Button>
          )}
        </ModalFooter>
      </ModalContainer>
    </Overlay>,
    document.body
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 44, 44, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  padding: ${theme.spacing.md};
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  ${cardGlass}
  background: ${theme.colors.bg.card};
  border-radius: 0;
  padding: ${theme.spacing.xl};
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  box-shadow: none;
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    max-width: 100%;
    padding: ${theme.spacing.lg};
    border-radius: 0;
    margin-top: auto;
    animation: slideUpMobile 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    @keyframes slideUpMobile {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const ModalIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.inverse};
  background: ${(props) => {
    switch (props.$type) {
      case "success":
        return theme.colors.status.success;
      case "error":
        return theme.colors.status.error;
      case "warning":
        return theme.colors.status.warning;
      case "confirm":
        return theme.colors.accent.primary;
      default:
        return theme.colors.status.info;
    }
  }};

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 56px;
    height: 56px;
    font-size: 28px;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
  text-align: center;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes.lg};
  }
`;

const ModalContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalMessage = styled.p`
  margin: 0;
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.text.secondary};
  text-align: center;
  line-height: ${theme.typography.lineHeights.relaxed};

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: ${theme.typography.sizes.sm};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;
