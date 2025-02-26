import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/Typo.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./lib/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ThemeProvider>
            <Router>
                <App />
            </Router>
            </ThemeProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>
);
