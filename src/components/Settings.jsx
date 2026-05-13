import React, { useState, useEffect } from 'react';
import './Settings.css';
import Dialog from './Dialog';

const Settings = () => {
  const [activeView, setActiveView] = useState('personalization');
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    accentColor: localStorage.getItem('accentColor') || '#0078d4',
    desktopWallpaper: localStorage.getItem('desktopWallpaper') || 'https://images.unsplash.com/photo-1557683316-973673baf926',
    lockWallpaper: localStorage.getItem('lockWallpaper') || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    fontSize: parseInt(localStorage.getItem('fontSize')) || 14,
    notifications: localStorage.getItem('notifications') !== 'false',
    animations: localStorage.getItem('animations') !== 'false',
    transparency: localStorage.getItem('transparency') !== 'false',
    soundEffects: localStorage.getItem('soundEffects') !== 'false',
    autoSave: localStorage.getItem('autoSave') !== 'false',
    userName: localStorage.getItem('userName') || 'User',
    userEmail: localStorage.getItem('userEmail') || 'user@portfolio.com',
  });

  const [dialog, setDialog] = useState({ isOpen: false, type: 'alert', title: '', message: '', onConfirm: null });

  const wallpapers = [
    'https://images.unsplash.com/photo-1557683316-973673baf926',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e',
    'https://images.unsplash.com/photo-1617791160505-6f00504e3519',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    'https://images.unsplash.com/photo-1620121692029-d088224ddc74',
  ];

  const accentColors = [
    { name: 'Blue', value: '#0078d4' },
    { name: 'Purple', value: '#8764b8' },
    { name: 'Red', value: '#e74856' },
    { name: 'Green', value: '#10893e' },
    { name: 'Orange', value: '#ff8c00' },
    { name: 'Pink', value: '#e3008c' },
    { name: 'Teal', value: '#00b7c3' },
    { name: 'Gold', value: '#ca5010' },
  ];

  useEffect(() => {
    // Apply theme
    document.body.setAttribute('data-theme', settings.theme);

    // Apply animations
    document.body.setAttribute('data-animations', settings.animations.toString());

    // Apply transparency
    document.body.setAttribute('data-transparency', settings.transparency.toString());

    // Apply accent color
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);

    // Apply desktop wallpaper
    const desktop = document.querySelector('.desktop') || document.querySelector('#desktop');
    if (desktop) {
      desktop.style.backgroundImage = `url(${settings.desktopWallpaper})`;
    }

    // Save to localStorage
    Object.entries(settings).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setDialog({
      isOpen: true,
      type: 'confirm',
      title: 'Reset Settings',
      message: 'Are you sure you want to reset all settings to default? This action cannot be undone.',
      onConfirm: () => {
        const defaultSettings = {
          theme: 'light',
          accentColor: '#0078d4',
          desktopWallpaper: 'https://images.unsplash.com/photo-1557683316-973673baf926',
          lockWallpaper: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
          fontSize: 14,
          notifications: true,
          animations: true,
          transparency: true,
          soundEffects: true,
          autoSave: true,
          userName: 'User',
          userEmail: 'user@portfolio.com',
        };
        setSettings(defaultSettings);
        setDialog({
          isOpen: true,
          type: 'alert',
          title: 'Settings',
          message: 'All settings have been reset to default.',
          onConfirm: () => { }
        });
      }
    });
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setDialog({
      isOpen: true,
      type: 'alert',
      title: 'Settings',
      message: 'Settings have been exported successfully.',
      onConfirm: () => { }
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            setSettings(imported);
            setDialog({
              isOpen: true,
              type: 'alert',
              title: 'Settings',
              message: 'Settings have been imported successfully.',
              onConfirm: () => { }
            });
          } catch (err) {
            setDialog({
              isOpen: true,
              type: 'alert',
              title: 'Error',
              message: 'Failed to import settings. Invalid file format.',
              onConfirm: () => { }
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const renderPersonalization = () => (
    <div className="settings-section">
      <h2>Personalization</h2>
      <p>Customize the look and feel of your desktop</p>

      <h3>Theme</h3>
      <div className="settings-option">
        <div>
          <div className="settings-option-label">Dark Mode</div>
          <div className="settings-option-desc">Switch between light and dark theme</div>
        </div>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={settings.theme === 'dark'}
            onChange={(e) => updateSetting('theme', e.target.checked ? 'dark' : 'light')}
          />
          <span className="settings-toggle-slider"></span>
        </label>
      </div>

      <div className="settings-option">
        <div>
          <div className="settings-option-label">Transparency Effects</div>
          <div className="settings-option-desc">Show transparency in windows and taskbar</div>
        </div>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={settings.transparency}
            onChange={(e) => updateSetting('transparency', e.target.checked)}
          />
          <span className="settings-toggle-slider"></span>
        </label>
      </div>

      <div className="settings-option">
        <div>
          <div className="settings-option-label">Animation Effects</div>
          <div className="settings-option-desc">Show animations when opening and closing windows</div>
        </div>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={settings.animations}
            onChange={(e) => updateSetting('animations', e.target.checked)}
          />
          <span className="settings-toggle-slider"></span>
        </label>
      </div>

      <h3>Desktop Background</h3>
      <div className="wallpaper-grid">
        {wallpapers.map((wp, i) => (
          <div
            key={i}
            className={`wallpaper-item ${wp === settings.desktopWallpaper ? 'selected' : ''}`}
            style={{ backgroundImage: `url(${wp})` }}
            onClick={() => updateSetting('desktopWallpaper', wp)}
          >
            {wp === settings.desktopWallpaper && <span className="wallpaper-check">✓</span>}
          </div>
        ))}
      </div>

      <h3>Lock Screen Background</h3>
      <div className="wallpaper-grid">
        {wallpapers.map((wp, i) => (
          <div
            key={i}
            className={`wallpaper-item ${wp === settings.lockWallpaper ? 'selected' : ''}`}
            style={{ backgroundImage: `url(${wp})` }}
            onClick={() => updateSetting('lockWallpaper', wp)}
          >
            {wp === settings.lockWallpaper && <span className="wallpaper-check">✓</span>}
          </div>
        ))}
      </div>

      <h3>Accent Color</h3>
      <div className="color-grid">
        {accentColors.map((color, i) => (
          <div
            key={i}
            className={`color-item ${color.value === settings.accentColor ? 'selected' : ''}`}
            style={{ backgroundColor: color.value }}
            onClick={() => updateSetting('accentColor', color.value)}
            title={color.name}
          >
            {color.value === settings.accentColor && <span className="color-check">✓</span>}
          </div>
        ))}
      </div>

      <h3>Font Size</h3>
      <div className="settings-option">
        <div style={{ flex: 1 }}>
          <div className="settings-option-label">System Font Size</div>
          <div className="settings-option-desc">Adjust the size of text, apps, and other items</div>
        </div>
        <div className="font-size-control">
          <button onClick={() => updateSetting('fontSize', Math.max(10, settings.fontSize - 2))}>-</button>
          <span>{settings.fontSize}px</span>
          <button onClick={() => updateSetting('fontSize', Math.min(20, settings.fontSize + 2))}>+</button>
        </div>
      </div>
    </div>
  );

  const renderSystem = () => (
    <div className="settings-section">
      <h2>System</h2>
      <p>Display, notifications, power, and storage</p>

      <h3>Display</h3>
      <div className="settings-option">
        <div>
          <div className="settings-option-label">Resolution</div>
          <div className="settings-option-desc">1920 × 1080 (Recommended)</div>
        </div>
      </div>

      <div className="settings-option">
        <div>
          <div className="settings-option-label">Scale</div>
          <div className="settings-option-desc">100% (Recommended)</div>
        </div>
      </div>

      <h3>Notifications</h3>
      <div className="settings-option">
        <div>
          <div className="settings-option-label">Show Notifications</div>
          <div className="settings-option-desc">Get notifications from apps and other senders</div>
        </div>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => updateSetting('notifications', e.target.checked)}
          />
          <span className="settings-toggle-slider"></span>
        </label>
      </div>

      <h3>Sound</h3>
      <div className="settings-option">
        <div>
          <div className="settings-option-label">Sound Effects</div>
          <div className="settings-option-desc">Play sounds for system events</div>
        </div>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={settings.soundEffects}
            onChange={(e) => updateSetting('soundEffects', e.target.checked)}
          />
          <span className="settings-toggle-slider"></span>
        </label>
      </div>

      <h3>Storage</h3>
      <div className="storage-info">
        <div className="storage-bar">
          <div className="storage-used" style={{ width: '45%' }}></div>
        </div>
        <div className="storage-details">
          <span>115 GB used of 256 GB</span>
          <span>141 GB free</span>
        </div>
      </div>

      <h3>Performance</h3>
      <div className="settings-option">
        <div>
          <div className="settings-option-label">Auto-save</div>
          <div className="settings-option-desc">Automatically save your work in apps</div>
        </div>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={settings.autoSave}
            onChange={(e) => updateSetting('autoSave', e.target.checked)}
          />
          <span className="settings-toggle-slider"></span>
        </label>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="settings-section">
      <h2>Account</h2>
      <p>Your info, family & other users</p>

      <div className="account-card">
        <div className="account-avatar">
          {settings.userName.charAt(0).toUpperCase()}
        </div>
        <div className="account-info">
          <h3>{settings.userName}</h3>
          <p>{settings.userEmail}</p>
          <p className="account-type">Local Account</p>
        </div>
      </div>

      <h3>Profile Information</h3>
      <div className="settings-option">
        <div style={{ flex: 1 }}>
          <div className="settings-option-label">Name</div>
          <input
            type="text"
            className="settings-input"
            value={settings.userName}
            onChange={(e) => updateSetting('userName', e.target.value)}
            placeholder="Enter your name"
          />
        </div>
      </div>

      <div className="settings-option">
        <div style={{ flex: 1 }}>
          <div className="settings-option-label">Email</div>
          <input
            type="email"
            className="settings-input"
            value={settings.userEmail}
            onChange={(e) => updateSetting('userEmail', e.target.value)}
            placeholder="Enter your email"
          />
        </div>
      </div>

      <h3>Sign-in Options</h3>
      <div className="settings-option clickable">
        <div>
          <div className="settings-option-label">Password</div>
          <div className="settings-option-desc">Change your account password</div>
        </div>
        <span className="settings-arrow">›</span>
      </div>

      <h3>Privacy</h3>
      <div className="settings-option clickable">
        <div>
          <div className="settings-option-label">Activity History</div>
          <div className="settings-option-desc">Manage your activity history and privacy</div>
        </div>
        <span className="settings-arrow">›</span>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="settings-section">
      <h2>About</h2>
      <p>System information and specifications</p>

      <div className="about-card">
        <div className="about-logo">💻</div>
        <h3>Windows Portfolio OS</h3>
        <p className="about-version">Version 11.0.22000</p>
      </div>

      <h3>Device Specifications</h3>
      <div className="spec-grid">
        <div className="spec-item">
          <div className="spec-label">Device name</div>
          <div className="spec-value">PORTFOLIO-PC</div>
        </div>
        <div className="spec-item">
          <div className="spec-label">Processor</div>
          <div className="spec-value">Web Browser Engine</div>
        </div>
        <div className="spec-item">
          <div className="spec-label">Installed RAM</div>
          <div className="spec-value">Browser Allocated</div>
        </div>
        <div className="spec-item">
          <div className="spec-label">System type</div>
          <div className="spec-value">64-bit operating system</div>
        </div>
      </div>

      <h3>Settings Management</h3>
      <div className="settings-actions">
        <button className="settings-btn" onClick={handleExport}>
          📥 Export Settings
        </button>
        <button className="settings-btn" onClick={handleImport}>
          📤 Import Settings
        </button>
        <button className="settings-btn settings-btn-danger" onClick={handleReset}>
          🔄 Reset All Settings
        </button>
      </div>

      <div className="about-footer">
        <p>© 2025 Portfolio OS. All rights reserved.</p>
        <p>Built with React • Designed for the web</p>
      </div>
    </div>
  );

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <div
          className={`settings-nav-item ${activeView === 'personalization' ? 'active' : ''}`}
          onClick={() => setActiveView('personalization')}
        >
          <span className="settings-nav-icon">🎨</span>
          <span>Personalization</span>
        </div>
        <div
          className={`settings-nav-item ${activeView === 'system' ? 'active' : ''}`}
          onClick={() => setActiveView('system')}
        >
          <span className="settings-nav-icon">💻</span>
          <span>System</span>
        </div>
        <div
          className={`settings-nav-item ${activeView === 'account' ? 'active' : ''}`}
          onClick={() => setActiveView('account')}
        >
          <span className="settings-nav-icon">👤</span>
          <span>Account</span>
        </div>
        <div
          className={`settings-nav-item ${activeView === 'about' ? 'active' : ''}`}
          onClick={() => setActiveView('about')}
        >
          <span className="settings-nav-icon">ℹ️</span>
          <span>About</span>
        </div>
      </div>

      <div className="settings-main">
        {activeView === 'personalization' && renderPersonalization()}
        {activeView === 'system' && renderSystem()}
        {activeView === 'account' && renderAccount()}
        {activeView === 'about' && renderAbout()}
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

export default Settings;
