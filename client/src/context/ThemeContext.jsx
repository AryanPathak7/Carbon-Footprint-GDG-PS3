import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isHighContrast, setIsHighContrast] = useState(localStorage.getItem('highContrast') === 'true');
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'normal'); // 'normal', 'large', 'xlarge'

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Manage light/dark theme
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Manage high contrast
    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', isHighContrast);
  }, [isHighContrast]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Reset classes
    root.classList.remove('text-lg', 'text-xl');
    
    if (fontSize === 'large') {
      root.classList.add('text-lg'); // shifts base font sizes up
    } else if (fontSize === 'xlarge') {
      root.classList.add('text-xl');
    }
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => !prev);
  };

  const changeFontSize = (size) => {
    setFontSize(size);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isHighContrast,
        toggleHighContrast,
        fontSize,
        changeFontSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
