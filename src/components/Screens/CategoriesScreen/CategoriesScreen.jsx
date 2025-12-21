import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getCategories } from "../../../services/firestoreService";

export default function CategoriesScreen() {
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
      console.error("Error loading categories:", error);
    }
    setLoading(false);
  };

  const handleCategorySelect = (categoryId) => {
    navigate(`/questions/${categoryId}`);
  };

  if (loading) {
    return (
      <Container>
        <h1>🎯 MOST</h1>
        <LoadingText>⏳ Загрузка категорий...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <CategoriesGrid>
        {categories.map((cat) => (
          <CategoryButton key={cat.id} onClick={() => handleCategorySelect(cat.id)}>
            <span className="emoji">{cat.emoji}</span>
            <span className="name">{cat.name}</span>
          </CategoryButton>
        ))}
      </CategoriesGrid>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <AdminButton onClick={() => navigate("/admin")}>⚙️ Админ-панель</AdminButton>
      </div>
    </Container>
  );
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryButton = styled.button`
  background: white;
  border: none;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-weight: 600;
  color: #333;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    background: #f0f4ff;
  }

  .emoji {
    font-size: 32px;
    display: block;
    margin-bottom: 10px;
  }

  .name {
    font-size: 14px;
    color: #333;
  }
`;

const LoadingText = styled.div`
  color: white;
  text-align: center;
  font-size: 16px;
  margin-top: 40px;
`;

const AdminButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    color: #667eea;
  }
`;
