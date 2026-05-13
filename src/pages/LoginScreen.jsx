import React, { useState, useEffect } from 'react';
import './LoginScreen.css';

const LoginScreen = ({ onLogin }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // User data matching original
  const users = [
    {
      id: 'user',
      name: 'User',
      avatar: '👤',
      type: 'No password',
      requiresPassword: false
    },
    {
      id: 'admin',
      name: 'Administrator',
      avatar: '👨‍💼',
      type: 'Signed in',
      requiresPassword: true,
      password: 'admin123'
    }
  ];

  const handleUserSelect = (user) => {
    if (!user.requiresPassword) {
      // Login immediately for users without password
      onLogin(user);
    } else {
      // Show password input
      setSelectedUser(user);
      setError('');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedUser && password === selectedUser.password) {
      onLogin(selectedUser);
    } else {
      setError('Incorrect password!');
      setPassword('');
    }
  };

  const handleBack = () => {
    setSelectedUser(null);
    setPassword('');
    setError('');
  };

  return (
    <div className="login-screen" id="login-screen">
      <div className="login-overlay"></div>
      <div className="login-content">
        <div className="login-time">
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        <div className="login-date">
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        {!selectedUser ? (
          <div className="user-selection">
            {users.map(user => (
              <div
                key={user.id}
                className="user-card"
                onClick={() => handleUserSelect(user)}
              >
                <div className="user-avatar">{user.avatar}</div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-type">{user.type}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="password-section">
            <form onSubmit={handleLogin}>
              <input
                type="password"
                className="password-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <button type="submit" className="login-btn">
                Sign in →
              </button>
            </form>
            {error && <div className="login-error">{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
