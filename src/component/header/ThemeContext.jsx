// ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define light and dark themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// Create a Theme Context
export const ThemeContext = createContext();

export const ThemeProviderWrapper = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('selectedTheme') || 'light');

  // Update the local storage and document body when the theme changes
  useEffect(() => {
    document.body.style.backgroundColor = theme === 'dark' ? 'black' : 'white';
    localStorage.setItem('selectedTheme', theme);
  }, [theme]);

  // Choose the correct theme object based on the current theme
  const themeObject = theme === 'dark' ? darkTheme : lightTheme;

  // Create the context value
  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={themeObject}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
