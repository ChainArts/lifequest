import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/Typo.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./lib/ThemeContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider>
            <Router>
                <App />
            </Router>
        </ThemeProvider>
    </React.StrictMode>
);
