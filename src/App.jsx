import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";
import { theme } from "./theme/theme";
import {
  AdminPanel,
  QuestionScreen,
  ResultScreen,
  CategoriesScreen,
} from "./components/Screens";

export const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${theme.colors.bg.primary};
  font-family: ${theme.typography.fontFamily};
  color: ${theme.colors.text.primary};
  overflow-x: hidden;
`;

function AppContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("admin") === "true" || searchParams.get("start") === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <AppContainer>
      <Routes>
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="/" element={<CategoriesScreen />} />
        <Route path="/questions/:categoryId" element={<QuestionScreen />} />
        <Route path="/results/:questionId/:categoryId" element={<ResultScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppContainer>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
