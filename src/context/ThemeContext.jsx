import React, { createContext, useContext, useEffect, useState } from "react";

// Create a context for theme management
export const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if there's a theme in localStorage, otherwise default to 'dark'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

  // Update theme in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    // Apply theme to the HTML element
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  // Value to be provided by the context
  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark"
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
