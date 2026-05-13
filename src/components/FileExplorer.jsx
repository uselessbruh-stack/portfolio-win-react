import React, { useState } from 'react';
import './FileExplorer.css';

const FileExplorer = () => {
  const [currentPath, setCurrentPath] = useState(['This PC']);
  const [history, setHistory] = useState([['This PC']]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // File system structure
  const fileSystem = {
    'This PC': [
      { name: 'Desktop', type: 'folder', icon: '🖥️' },
      { name: 'Documents', type: 'folder', icon: '📁' },
      { name: 'Downloads', type: 'folder', icon: '📥' },
      { name: 'Pictures', type: 'folder', icon: '🖼️' },
      { name: 'Music', type: 'folder', icon: '🎵' },
      { name: 'Videos', type: 'folder', icon: '🎬' },
    ],
    'Desktop': [
      { name: 'Projects', type: 'folder', icon: '📁' },
      { name: 'Notes.txt', type: 'file', icon: '📄' },
    ],
    'Documents': [
      { name: 'Resume.pdf', type: 'file', icon: '📄' },
      { name: 'Cover Letter.docx', type: 'file', icon: '📄' },
      { name: 'Work', type: 'folder', icon: '📁' },
    ],
    'Downloads': [
      { name: 'Setup.exe', type: 'file', icon: '⚙️' },
      { name: 'Image.png', type: 'file', icon: '🖼️' },
    ],
    'Pictures': [
      { name: 'Vacation', type: 'folder', icon: '📁' },
      { name: 'Screenshot.png', type: 'file', icon: '🖼️' },
    ],
    'Music': [
      { name: 'Playlist', type: 'folder', icon: '📁' },
      { name: 'Song.mp3', type: 'file', icon: '🎵' },
    ],
    'Videos': [
      { name: 'Movie.mp4', type: 'file', icon: '🎬' },
    ],
    'Projects': [
      { name: 'Portfolio', type: 'folder', icon: '📁' },
      { name: 'README.md', type: 'file', icon: '📄' },
    ],
    'Work': [
      { name: 'Reports', type: 'folder', icon: '📁' },
      { name: 'Presentation.pptx', type: 'file', icon: '📊' },
    ],
    'Vacation': [
      { name: 'Beach.jpg', type: 'file', icon: '🖼️' },
      { name: 'Mountain.jpg', type: 'file', icon: '🖼️' },
    ],
    'Playlist': [
      { name: 'Favorites.m3u', type: 'file', icon: '🎵' },
    ],
    'Portfolio': [
      { name: 'index.html', type: 'file', icon: '🌐' },
      { name: 'style.css', type: 'file', icon: '🎨' },
    ],
    'Reports': [
      { name: 'Q1_Report.xlsx', type: 'file', icon: '📊' },
    ],
  };

  const getCurrentItems = () => {
    const currentFolder = currentPath[currentPath.length - 1];
    return fileSystem[currentFolder] || [];
  };

  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      const newPath = [...currentPath, item.name];
      setCurrentPath(newPath);

      // Update history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newPath);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } else {
      // File clicked - could open in appropriate app
      console.log('Opening file:', item.name);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  const handleUp = () => {
    if (currentPath.length > 1) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newPath);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleRefresh = () => {
    // Force re-render
    setCurrentPath([...currentPath]);
  };

  const items = getCurrentItems();

  return (
    <div className="explorer-container">
      <div className="explorer-toolbar">
        <button
          className="explorer-btn"
          onClick={handleBack}
          disabled={historyIndex === 0}
          title="Back"
        >
          ◀ Back
        </button>
        <button
          className="explorer-btn"
          onClick={handleForward}
          disabled={historyIndex >= history.length - 1}
          title="Forward"
        >
          ▶ Forward
        </button>
        <button
          className="explorer-btn"
          onClick={handleUp}
          disabled={currentPath.length === 1}
          title="Up"
        >
          ⬆ Up
        </button>
        <button
          className="explorer-btn"
          onClick={handleRefresh}
          title="Refresh"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="explorer-path">
        <span className="path-icon">📁</span>
        <span className="path-text">{currentPath.join(' > ')}</span>
      </div>

      <div className="explorer-content">
        {items.length === 0 ? (
          <div className="empty-folder">
            <div className="empty-icon">📂</div>
            <div className="empty-text">This folder is empty</div>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="folder-item"
              onDoubleClick={() => handleItemClick(item)}
            >
              <div className="folder-icon">{item.icon}</div>
              <div className="folder-name">{item.name}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
