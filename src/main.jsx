import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { initializeCategories } from "./services/firestoreService";

initializeCategories().catch(console.error);

createRoot(document.getElementById("root")).render(<App />);
