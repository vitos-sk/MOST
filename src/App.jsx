import { useState } from "react";

import AdminPanel from "./components/Admin/AdminPanel";

function App() {
  const [mode, setMode] = useState("admin"); // 'admin' или 'app'

  return (
    <>
      {mode === "admin" ? (
        <AdminPanel />
      ) : (
        <Placeholder>
          <h1>🎯 Majority</h1>
          <p>Приложение в разработке...</p>
          <button onClick={() => setMode("admin")}>Вернуться в админку</button>
        </Placeholder>
      )}
    </>
  );
}

export default App;
