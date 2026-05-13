import React, { useState, useEffect } from 'react';
import './Taskbar.css';

const Taskbar = ({ windows, onStartClick, onWindowSelect, onLock, startMenuOpen }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleStartClick = (e) => {
    e.stopPropagation();
    onStartClick(e);
  };

  return (
    <div id="taskbar" className="taskbar">
      <div className="taskbar-center">
        <div className={`start-button ${startMenuOpen ? 'active' : ''}`} onClick={handleStartClick}>
          <div className="start-icon"></div>
        </div>
        <div className="taskbar-apps">
          {windows.map((window) => (
            <div
              key={window.id}
              className={`taskbar-app ${window.isActive ? 'active' : ''}`}
              onClick={() => onWindowSelect(window.id)}
              title={window.title}
            >
              <div className="taskbar-app-icon">{window.icon}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="system-tray">
        <span className="system-icon">🔊</span>
        <span className="system-icon">📶</span>
        <span className="system-icon">🔋</span>
        <div className="taskbar-time">
          <div>{formatTime(currentTime)}</div>
          <div>{formatDate(currentTime)}</div>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
