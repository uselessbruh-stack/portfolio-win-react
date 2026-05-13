import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [desktopIcons, setDesktopIcons] = useState([]);

  // Window management functions (to be implemented)
  const openWindow = (appId) => {
    console.log('Opening window:', appId);
    // Implementation to be added
  };

  const closeWindow = (windowId) => {
    console.log('Closing window:', windowId);
    // Implementation to be added
  };

  const minimizeWindow = (windowId) => {
    console.log('Minimizing window:', windowId);
    // Implementation to be added
  };

  const maximizeWindow = (windowId) => {
    console.log('Maximizing window:', windowId);
    // Implementation to be added
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    windows,
    setWindows,
    activeWindow,
    setActiveWindow,
    startMenuOpen,
    setStartMenuOpen,
    searchOpen,
    setSearchOpen,
    desktopIcons,
    setDesktopIcons,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
