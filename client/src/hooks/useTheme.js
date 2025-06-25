import { useState, useEffect } from 'react';

const useTheme = (defaultTheme = 'dark') => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or use default
    return localStorage.getItem('theme') || defaultTheme;
  });
  
  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', theme);
    
    // Update document body class
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  return { theme, toggleTheme };
};

export default useTheme;