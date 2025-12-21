import styled from "styled-components";
import { useAuth } from "../../../context/AuthContext";

const BoxHeader = ({ className }) => {
  const { user } = useAuth();
  return (
    <div className={className}>
      <h1>🎯 Majority</h1>
      <p>Выберите категорию для начала</p>
      {user && (
        <p style={{ fontSize: "12px", opacity: 0.7, marginTop: "10px" }}>
          👤 {user.firstName} {user.lastName}
          {user.isMock && " (тестовый режим)"}
        </p>
      )}
    </div>
  );
};

export const Header = styled(BoxHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: #646464;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  text-align: center;
  margin-bottom: 40px;
  color: white;

  h1 {
    font-size: 32px;
    margin: 0 0 10px 0;
  }

  p {
    font-size: 16px;
    opacity: 0.9;
    margin: 0;
  }
`;
