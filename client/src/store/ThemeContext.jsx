import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : { mode: 'light', primaryColor: '#3B82F6', accentColor: '#10B981' };
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));

    // Apply theme to document
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply custom colors
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--accent-color', theme.accentColor);
  }, [theme]);

  const toggleDarkMode = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'dark' ? 'light' : 'dark'
    }));
  };

  const updateColors = (primaryColor, accentColor) => {
    setTheme(prev => ({
      ...prev,
      primaryColor: primaryColor || prev.primaryColor,
      accentColor: accentColor || prev.accentColor
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleDarkMode, updateColors }}>
      {children}
    </ThemeContext.Provider>
  );
}
