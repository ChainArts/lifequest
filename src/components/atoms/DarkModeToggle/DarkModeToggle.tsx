// DarkModeToggle.jsx
import { useContext } from "react";
import { ThemeContext } from "../../../lib/ThemeContext";
import "./DarkModeToggle.scss";

const DarkModeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div className="dark-mode-toggle">
            <input type="checkbox" id="dark-mode-toggle-checkbox" checked={theme === "dark"} onChange={toggleTheme} className="toggle-input" />
            <label htmlFor="dark-mode-toggle-checkbox" className="toggle-label">
                <span className="toggle-ball" />
            </label>
        </div>
    );
};

export default DarkModeToggle;
