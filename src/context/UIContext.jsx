import { createContext, useState, useEffect } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // Default to dark mode
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('novatra_theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('novatra_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const value = {
    theme,
    toggleTheme,
    sidebarOpen,
    toggleSidebar
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};
