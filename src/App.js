import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import LoginScreen from './pages/LoginScreen';
import Desktop from './pages/Desktop';
import { AppProvider } from './context/AppContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLock = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                !isLoggedIn ? (
                  <LoginScreen onLogin={handleLogin} />
                ) : (
                  <Navigate to="/desktop" replace />
                )
              }
            />
            <Route
              path="/desktop/*"
              element={
                isLoggedIn ? (
                  <Desktop currentUser={currentUser} onLock={handleLock} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;

