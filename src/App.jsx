import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import styled from "styled-components";
import AdminPanel from "./components/Admin/AdminPanel";
import CategoriesScreen from "./components/Screens/CategoriesScreen/CategoriesScreen";
import QuestionScreen from "./components/Screens/QuestionScreen/QuestionScreen";
import ResultScreen from "./components/Screens/ResultScreen/ResultScreen";
import { Header } from "./components/UI-componets/Header/Header";

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Header />
        <Routes>
          {/* Admin Panel */}
          <Route path="/admin/*" element={<AdminPanel />} />

          {/* User App - Main Flow */}
          <Route path="/" element={<CategoriesScreen />} />
          <Route path="/questions/:categoryId" element={<QuestionScreen />} />
          <Route path="/results/:questionId/:categoryId" element={<ResultScreen />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
