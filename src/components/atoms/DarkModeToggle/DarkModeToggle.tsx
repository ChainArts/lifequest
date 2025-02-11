import { useContext } from 'react';
import { ThemeContext } from '../../../lib/ThemeContext';
import './DarkModeToggle.scss';

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme} className="dark-mode-toggle">
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
};

export default DarkModeToggle;