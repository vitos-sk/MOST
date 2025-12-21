import styled from "styled-components";

// ===== MAIN CONTAINERS =====
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
`;

export const Title = styled.h1`
  margin: 0;
  color: #333;
  font-size: 24px;
`;

// ===== TAB COMPONENTS =====
export const TabContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

export const TabButtons = styled.div`
  display: flex;
  border-bottom: 2px solid #f0f0f0;
  padding: 0;
`;

export const TabButton = styled.button`
  flex: 1;
  padding: 15px 20px;
  background: ${(props) => (props.$active ? "#667eea" : "white")};
  color: ${(props) => (props.$active ? "white" : "#666")};
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.$active ? "#5568d3" : "#f5f5f5")};
  }
`;

export const TabContent = styled.div`
  padding: 20px;
`;

// ===== BUTTONS =====
export const Button = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #5568d3;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ButtonSecondary = styled(Button)`
  background: #6c757d;

  &:hover:not(:disabled) {
    background: #5a6268;
  }
`;

export const ButtonDelete = styled.button`
  flex: 1;
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover:not(:disabled) {
    background: #ee5a52;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// ===== FORM COMPONENTS =====
export const Form = styled.form`
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

// ===== INFO & STATS =====
export const StatsInfo = styled.div`
  background: #f0f4ff;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #667eea;

  p {
    margin: 8px 0;
    color: #333;
    font-size: 14px;
  }

  strong {
    color: #667eea;
  }
`;

// ===== LIST & CARDS =====
export const ItemsList = styled.div`
  display: grid;
  gap: 15px;
`;

export const ItemCard = styled.div`
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    background: #f9f7ff;
  }
`;

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

export const ItemTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 16px;
`;

export const Badge = styled.span`
  display: inline-block;
  background: ${(props) => props.$color || "#667eea"};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

export const EmptyState = styled.p`
  text-align: center;
  color: #999;
  padding: 40px 20px;
  font-size: 16px;
`;

// ===== CONTENT BLOCKS =====
export const ContentBlock = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;

  p {
    margin: 5px 0;
  }
`;

export const ExplanationBlock = styled.div`
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 13px;
  line-height: 1.5;

  p {
    margin: 8px 0;
  }

  strong {
    color: #667eea;
  }
`;
