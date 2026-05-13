import React from 'react';
import './StartMenu.css';
import Dialog from './Dialog';

// All available apps (for Start Menu)
const allApps = [
  { id: 'explorer', name: 'File Explorer', icon: '📁', color: '#ffc107' },
  { id: 'browser', name: 'Microsoft Edge', icon: '🌐', color: '#0078d4' },
  { id: 'calculator', name: 'Calculator', icon: '🔢', color: '#0078d4' },
  { id: 'calendar', name: 'Calendar', icon: '📅', color: '#0078d4' },
  { id: 'photos', name: 'Photos', icon: '🖼️', color: '#0078d4' },
  { id: 'camera', name: 'Camera', icon: '📷', color: '#0078d4' },
  { id: 'notepad', name: 'Notepad', icon: '📝', color: '#0078d4' },
  { id: 'terminal', name: 'Terminal', icon: '💻', color: '#0078d4' },
  { id: 'settings', name: 'Settings', icon: '⚙️', color: '#0078d4' },
  { id: 'games', name: 'Xbox', icon: '🎮', color: '#107c10' },
  { id: 'resume', name: 'Resume', icon: '📄', color: '#0078d4' },
  { id: 'portfolio', name: 'Portfolio', icon: '💼', color: '#0078d4' },
  { id: 'ubgpt', name: 'UB GPT', icon: '🤖', color: '#0078d4' },
];

const StartMenu = ({ isOpen, onClose, onAppClick, onLock }) => {
  const [dialog, setDialog] = React.useState({ isOpen: false, type: 'alert', title: '', message: '', onConfirm: null });

  console.log('StartMenu render - isOpen:', isOpen);

  if (!isOpen) {
    return null;
  }

  const handleAppClick = (e, appId) => {
    e.stopPropagation();
    onAppClick(appId);
    onClose();
  };

  const handleLock = (e) => {
    e.stopPropagation();
    onLock();
    onClose();
  };

  const handleSleep = (e) => {
    e.stopPropagation();
    setDialog({
      isOpen: true,
      type: 'confirm',
      title: 'Sleep',
      message: 'Put your computer to sleep?',
      onConfirm: () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
          setDialog({
            isOpen: true,
            type: 'alert',
            title: 'Sleep Mode',
            message: 'Computer is in sleep mode. Click OK to wake up.',
            onConfirm: () => {
              document.body.style.opacity = '1';
            }
          });
        }, 500);
      }
    });
  };

  const handleRestart = (e) => {
    e.stopPropagation();
    setDialog({
      isOpen: true,
      type: 'confirm',
      title: 'Restart',
      message: 'Restart your computer?',
      onConfirm: () => {
        window.location.reload();
      }
    });
  };

  const handleShutdown = (e) => {
    e.stopPropagation();
    setDialog({
      isOpen: true,
      type: 'confirm',
      title: 'Shut down',
      message: 'Shut down your computer?',
      onConfirm: () => {
        document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #000; color: #fff; font-size: 24px;">Shutting down...</div>';
        setTimeout(() => {
          document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #000; color: #fff; font-size: 24px;">System has been shut down. You can close this window.</div>';
        }, 2000);
      }
    });
  };

  return (
    <div
      id="start-menu"
      className="start-menu active"
      style={{
        position: 'fixed',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '680px',
        background: 'white',
        zIndex: 99999,
        border: '5px solid red',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="start-menu-header">
        <h2>Pinned</h2>
      </div>
      <div className="start-menu-apps">
        {allApps.map(app => (
          <div
            key={app.id}
            className="start-app"
            onClick={(e) => handleAppClick(e, app.id)}
          >
            <div className="start-app-icon">{app.icon}</div>
            <div className="start-app-name">{app.name}</div>
          </div>
        ))}
      </div>
      <div className="start-menu-footer">
        <div className="power-options">
          <button className="power-btn" onClick={handleLock} title="Lock">
            🔒
          </button>
          <button className="power-btn" onClick={handleSleep} title="Sleep">
            😴
          </button>
          <button className="power-btn" onClick={handleRestart} title="Restart">
            🔄
          </button>
          <button className="power-btn" onClick={handleShutdown} title="Shut down">
            ⏻
          </button>
        </div>
      </div>

      <Dialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog({ ...dialog, isOpen: false })}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
      />
    </div>
  );
};

export default StartMenu;
