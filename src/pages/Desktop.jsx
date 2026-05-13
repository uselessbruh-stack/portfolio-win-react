import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Desktop.css';
import DesktopIcon from '../components/DesktopIcon';
import Taskbar from '../components/Taskbar';
import Window from '../components/Window';
import FileExplorer from '../components/FileExplorer';
import Browser from '../components/Browser';
import Xbox from '../components/Xbox';
import GamePlayer from '../components/GamePlayer';
import Resume from '../components/Resume';
import Portfolio from '../components/Portfolio';
import UBGPT from '../components/UBGPT';
import Calculator from '../components/Calculator';
import Calendar from '../components/Calendar';
import Camera from '../components/Camera';
import Photos from '../components/Photos';
import Notepad from '../components/Notepad';
import Settings from '../components/Settings';

const GRID_SIZE = 100;

// App definitions matching original
const apps = [
  { id: 'explorer', name: 'File Explorer', icon: '📁', color: '#ffc107' },
  { id: 'browser', name: 'Microsoft Edge', icon: '🌐', color: '#0078d4' },
  { id: 'games', name: 'Xbox', icon: '🎮', color: '#107c10' },
  { id: 'resume', name: 'Resume', icon: '📄', color: '#0078d4' },
  { id: 'portfolio', name: 'Portfolio', icon: '💼', color: '#0078d4' },
  { id: 'ubgpt', name: 'UB GPT', icon: '🤖', color: '#0078d4' },
  { id: 'calculator', name: 'Calculator', icon: '🔢', color: '#0078d4' },
  { id: 'calendar', name: 'Calendar', icon: '📅', color: '#0078d4' },
  { id: 'camera', name: 'Camera', icon: '📷', color: '#0078d4' },
  { id: 'photos', name: 'Photos', icon: '🖼️', color: '#0078d4' },
  { id: 'notepad', name: 'Notepad', icon: '🗒️', color: '#0078d4' },
  { id: 'settings', name: 'Settings', icon: '⚙️', color: '#0078d4' },
];

// Desktop icons - only first 6 apps
const desktopApps = apps.slice(0, 6);

const Desktop = ({ currentUser, onLock }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [iconGrid, setIconGrid] = useState({});
  const [iconPositions, setIconPositions] = useState({});
  const [windows, setWindows] = useState([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const highestZIndexRef = useRef(100);

  // Close start menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const startButton = document.querySelector('.start-button');

      // Check if click is on start button or its children
      if (startButton && startButton.contains(e.target)) {
        return;
      }

      // Check if click is inside start menu
      if (e.target.closest('[data-start-menu]')) {
        return;
      }

      // Otherwise close the menu
      setStartMenuOpen(false);
    };

    if (startMenuOpen) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [startMenuOpen]);

  // Parse open apps from URL path
  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 1) {
      // /desktop/app1+app2+app3
      const appsInUrl = pathParts.slice(1).join('').split('+');

      // Open apps that are in URL but not in windows
      appsInUrl.forEach(appId => {
        if (!windows.find(w => w.id === appId)) {
          openWindowById(appId);
        }
      });

      // Close windows that are not in URL
      const windowsToClose = windows.filter(w => !appsInUrl.includes(w.id));
      if (windowsToClose.length > 0) {
        setWindows(prev => prev.filter(w => appsInUrl.includes(w.id)));
      }
    } else if (pathParts.length === 1 && pathParts[0] === 'desktop') {
      // Just /desktop, close all windows
      if (windows.length > 0) {
        setWindows([]);
      }
    }
  }, [location.pathname]);

  // Update URL when windows change
  useEffect(() => {
    if (windows.length === 0) {
      if (location.pathname !== '/desktop') {
        navigate('/desktop', { replace: true });
      }
    } else {
      const openAppIds = windows.map(w => w.id).join('+');
      const expectedPath = `/desktop/${openAppIds}`;
      if (location.pathname !== expectedPath) {
        navigate(expectedPath, { replace: true });
      }
    }
  }, [windows.map(w => w.id).join(',')]);

  useEffect(() => {
    initializeIcons();
  }, []);

  const openWindowById = (appId) => {
    const app = apps.find(a => a.id === appId);
    if (!app) return;

    const newWindow = {
      id: appId,
      app: app,
      position: { x: 100 + windows.length * 30, y: 80 + windows.length * 30 },
      size: { width: 900, height: 600 },
      isActive: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: ++highestZIndexRef.current
    };

    setWindows(prev => [
      ...prev.map(w => ({ ...w, isActive: false })),
      newWindow
    ]);
  };

  const initializeIcons = () => {
    const newGrid = {};
    const newPositions = {};
    let row = 0;
    let col = 0;
    const maxRows = Math.floor((window.innerHeight - 100) / GRID_SIZE);

    desktopApps.forEach((app) => {
      const gridPos = { row, col };
      newPositions[app.id] = gridPos;
      newGrid[`${col},${row}`] = app.id;

      row++;
      if (row >= maxRows) {
        row = 0;
        col++;
      }
    });

    setIconGrid(newGrid);
    setIconPositions(newPositions);
  };

  const handleIconDoubleClick = (appId) => {
    // Check if window already exists
    const existingWindow = windows.find(w => w.id === appId);
    if (existingWindow) {
      // Restore if minimized and focus
      setWindows(prev => prev.map(w =>
        w.id === appId
          ? { ...w, isMinimized: false, isActive: true, zIndex: ++highestZIndexRef.current }
          : { ...w, isActive: false }
      ));
      return;
    }

    const app = apps.find(a => a.id === appId);
    if (!app) return;

    // Create new window
    const newWindow = {
      id: appId,
      app: app,
      position: { x: 100 + windows.length * 30, y: 80 + windows.length * 30 },
      size: { width: 900, height: 600 },
      isActive: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: ++highestZIndexRef.current
    };

    setWindows(prev => [
      ...prev.map(w => ({ ...w, isActive: false })),
      newWindow
    ]);
  };

  const handleIconMove = (appId, oldPos, newPos) => {
    const oldKey = `${oldPos.col},${oldPos.row}`;
    const newKey = `${newPos.col},${newPos.row}`;

    // Check if new position is occupied
    if (iconGrid[newKey] && iconGrid[newKey] !== appId) {
      // Find nearest free position
      const finalPos = findNearestFreeGrid(newPos.col, newPos.row, appId);
      const finalKey = `${finalPos.col},${finalPos.row}`;

      setIconGrid(prev => {
        const updated = { ...prev };
        delete updated[oldKey];
        updated[finalKey] = appId;
        return updated;
      });

      setIconPositions(prev => ({
        ...prev,
        [appId]: finalPos
      }));
    } else {
      setIconGrid(prev => {
        const updated = { ...prev };
        delete updated[oldKey];
        updated[newKey] = appId;
        return updated;
      });

      setIconPositions(prev => ({
        ...prev,
        [appId]: newPos
      }));
    }
  };

  const findNearestFreeGrid = (targetCol, targetRow, excludeAppId) => {
    if (!iconGrid[`${targetCol},${targetRow}`] || iconGrid[`${targetCol},${targetRow}`] === excludeAppId) {
      return { col: targetCol, row: targetRow };
    }

    const maxRows = Math.floor((window.innerHeight - 100) / GRID_SIZE);
    const maxCols = Math.floor((window.innerWidth - 100) / GRID_SIZE);

    for (let radius = 1; radius <= 10; radius++) {
      for (let dr = -radius; dr <= radius; dr++) {
        for (let dc = -radius; dc <= radius; dc++) {
          if (Math.abs(dr) !== radius && Math.abs(dc) !== radius) continue;

          const checkRow = targetRow + dr;
          const checkCol = targetCol + dc;
          const key = `${checkCol},${checkRow}`;

          if (checkRow >= 0 && checkRow < maxRows &&
            checkCol >= 0 && checkCol < maxCols &&
            (!iconGrid[key] || iconGrid[key] === excludeAppId)) {
            return { col: checkCol, row: checkRow };
          }
        }
      }
    }

    return { col: targetCol, row: targetRow };
  };

  const handleCloseWindow = (windowId) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
  };

  const handleMinimizeWindow = (windowId) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, isMinimized: true, isActive: false } : w
    ));
  };

  const handleMaximizeWindow = (windowId) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  const handleFocusWindow = (windowId) => {
    setWindows(prev => prev.map(w => ({
      ...w,
      isActive: w.id === windowId,
      zIndex: w.id === windowId ? ++highestZIndexRef.current : w.zIndex
    })));
  };

  const handleMoveWindow = (windowId, position) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, position } : w
    ));
  };

  const handleStartClick = (e) => {
    e.stopPropagation();
    setStartMenuOpen(prev => !prev);
  };

  const handleStartMenuClose = () => {
    setStartMenuOpen(false);
  };

  const handleStartMenuAppClick = (appId) => {
    handleIconDoubleClick(appId);
    setStartMenuOpen(false);
  };

  const handleGameOpen = (game) => {
    const gameWindow = {
      id: `game-${game.id}`,
      app: { name: game.name, icon: game.icon },
      position: { x: 100, y: 80 },
      size: { width: 900, height: 600 },
      isActive: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: ++highestZIndexRef.current,
      gameUrl: game.url
    };

    setWindows(prev => [
      ...prev.map(w => ({ ...w, isActive: false })),
      gameWindow
    ]);
  };

  const handleWindowSelect = (windowId) => {
    const window = windows.find(w => w.id === windowId);
    if (!window) return;

    if (window.isMinimized) {
      // Restore and focus
      setWindows(prev => prev.map(w =>
        w.id === windowId
          ? { ...w, isMinimized: false, isActive: true, zIndex: ++highestZIndexRef.current }
          : { ...w, isActive: false }
      ));
    } else if (window.isActive) {
      // Minimize if already active
      handleMinimizeWindow(windowId);
    } else {
      // Just focus
      handleFocusWindow(windowId);
    }
  };

  return (
    <div className="desktop" id="desktop">
      <div className="desktop-content">
        <div className="desktop-icons" id="desktop-icons">
          {desktopApps.map((app) => (
            iconPositions[app.id] && (
              <DesktopIcon
                key={app.id}
                app={app}
                gridPos={iconPositions[app.id]}
                onDoubleClick={handleIconDoubleClick}
                onMove={handleIconMove}
                isOccupied={false}
              />
            )
          ))}
        </div>
      </div>

      <Taskbar
        windows={windows.map(w => ({
          id: w.id,
          title: w.app.name,
          icon: w.app.icon,
          isActive: w.isActive
        }))}
        onStartClick={handleStartClick}
        onWindowSelect={handleWindowSelect}
        onLock={onLock}
        startMenuOpen={startMenuOpen}
      />

      <div className="windows-container">
        {startMenuOpen && (
          <div
            data-start-menu="true"
            style={{
              position: 'fixed',
              bottom: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '600px',
              height: '680px',
              background: 'rgba(243, 243, 243, 0.95)',
              backdropFilter: 'blur(60px) saturate(150%)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.18)',
              zIndex: 9998,
              display: 'flex',
              flexDirection: 'column',
              pointerEvents: 'auto'
            }}
          >
            <div style={{ padding: '32px 40px 16px', color: '#1a1a1a' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Pinned</h2>
            </div>
            <div style={{
              padding: '16px 40px 20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              overflowY: 'auto',
              flex: 1,
              paddingBottom: '70px',
              alignContent: 'flex-start'
            }}>
              {[
                { id: 'explorer', name: 'File Explorer', icon: '📁' },
                { id: 'browser', name: 'Microsoft Edge', icon: '🌐' },
                { id: 'calculator', name: 'Calculator', icon: '🔢' },
                { id: 'calendar', name: 'Calendar', icon: '📅' },
                { id: 'photos', name: 'Photos', icon: '🖼️' },
                { id: 'camera', name: 'Camera', icon: '📷' },
                { id: 'notepad', name: 'Notepad', icon: '📝' },
                { id: 'terminal', name: 'Terminal', icon: '💻' },
                { id: 'settings', name: 'Settings', icon: '⚙️' },
                { id: 'games', name: 'Xbox', icon: '🎮' },
                { id: 'resume', name: 'Resume', icon: '📄' },
                { id: 'portfolio', name: 'Portfolio', icon: '💼' },
                { id: 'ubgpt', name: 'UB GPT', icon: '🤖' },
              ].map(app => (
                <div
                  key={app.id}
                  onClick={() => handleStartMenuAppClick(app.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    width: 'calc((100% - 80px) / 6)',
                    transition: 'background 0.1s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontSize: '32px', marginBottom: '6px' }}>{app.icon}</div>
                  <div style={{ color: '#1a1a1a', fontSize: '11px', textAlign: 'center' }}>{app.name}</div>
                </div>
              ))}
            </div>
            <div style={{
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'flex-end',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'inherit',
              borderRadius: '0 0 12px 12px'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={onLock} style={{ width: '40px', height: '40px', border: 'none', background: 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '18px' }} title="Lock">🔒</button>
                <button style={{ width: '40px', height: '40px', border: 'none', background: 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '18px' }} title="Sleep">😴</button>
                <button onClick={() => window.location.reload()} style={{ width: '40px', height: '40px', border: 'none', background: 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '18px' }} title="Restart">🔄</button>
                <button style={{ width: '40px', height: '40px', border: 'none', background: 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '18px' }} title="Shut down">⏻</button>
              </div>
            </div>
          </div>
        )}
        {windows.map((window) => (
          <Window
            key={window.id}
            id={window.id}
            app={window.app}
            position={window.position}
            size={window.size}
            isActive={window.isActive}
            isMinimized={window.isMinimized}
            isMaximized={window.isMaximized}
            zIndex={window.zIndex}
            onClose={handleCloseWindow}
            onMinimize={handleMinimizeWindow}
            onMaximize={handleMaximizeWindow}
            onFocus={handleFocusWindow}
            onMove={handleMoveWindow}
          >
            {window.id === 'explorer' ? (
              <FileExplorer />
            ) : window.id === 'browser' ? (
              <Browser />
            ) : window.id === 'games' ? (
              <Xbox onGameOpen={handleGameOpen} />
            ) : window.id.startsWith('game-') ? (
              <GamePlayer gameUrl={window.gameUrl} gameName={window.app.name} />
            ) : window.id === 'calculator' ? (
              <Calculator />
            ) : window.id === 'calendar' ? (
              <Calendar />
            ) : window.id === 'camera' ? (
              <Camera onOpenGallery={() => handleIconDoubleClick('photos')} />
            ) : window.id === 'photos' ? (
              <Photos />
            ) : window.id === 'notepad' ? (
              <Notepad />
            ) : window.id === 'settings' ? (
              <Settings />
            ) : window.id === 'resume' ? (
              <Resume />
            ) : window.id === 'portfolio' ? (
              <Portfolio />
            ) : window.id === 'ubgpt' ? (
              <UBGPT />
            ) : (
              <div style={{ padding: '20px' }}>
                <h2>Window Content</h2>
                <p>App: {window.app.name}</p>
                <p>This is a placeholder. App content will be added later.</p>
              </div>
            )}
          </Window>
        ))}
      </div>
    </div>
  );
};

export default Desktop;
