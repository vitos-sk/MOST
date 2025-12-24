import { createContext, useContext, useState } from "react";
import { Modal } from "../components/UI-components/Modal";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);

  const showModal = ({ title, message, type = "info", confirmText, onConfirm }) => {
    return new Promise((resolve) => {
      setModal({
        title,
        message,
        type,
        confirmText,
        onConfirm: () => {
          if (onConfirm) onConfirm();
          resolve(true);
        },
      });
    });
  };

  const hideModal = () => {
    // Для confirm модалок onCancel уже вызывается через кнопку
    // Здесь просто закрываем модалку
    setModal(null);
  };

  const showSuccess = (message, title = "Успешно") => {
    return showModal({ title, message, type: "success" });
  };

  const showError = (message, title = "Ошибка") => {
    return showModal({ title, message, type: "error" });
  };

  const showInfo = (message, title = "Информация") => {
    return showModal({ title, message, type: "info" });
  };

  const showWarning = (message, title = "Предупреждение") => {
    return showModal({ title, message, type: "warning" });
  };

  const showConfirm = (message, title = "Подтверждение", confirmText = "Подтвердить") => {
    return new Promise((resolve) => {
      setModal({
        title,
        message,
        type: "confirm",
        confirmText,
        onConfirm: () => {
          resolve(true);
          setModal(null);
        },
        onCancel: () => {
          resolve(false);
          setModal(null);
        },
      });
    });
  };

  return (
    <ModalContext.Provider
      value={{
        showModal,
        hideModal,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        showConfirm,
      }}
    >
      {children}
      {modal && (
        <Modal
          isOpen={!!modal}
          onClose={hideModal}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          confirmText={modal.confirmText}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
};
