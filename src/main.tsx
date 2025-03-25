import{ createRoot } from "react-dom/client";
import App from "./App";
import "./styles/Typo.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./lib/ThemeContext";

createRoot(document.getElementById("root")!).render(
    <ThemeProvider>
        <Router>
            <App />
        </Router>
    </ThemeProvider>
);
