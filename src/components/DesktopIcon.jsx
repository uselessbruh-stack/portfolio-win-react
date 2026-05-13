import React, { useState, useRef } from 'react';
import './DesktopIcon.css';

const GRID_SIZE = 100;
const ICON_PADDING = 15;

const DesktopIcon = ({ app, gridPos, onDoubleClick, onMove, isOccupied }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const iconRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const originalPosRef = useRef(null);

  const gridToPixels = (pos) => ({
    x: ICON_PADDING + (pos.col * GRID_SIZE),
    y: ICON_PADDING + (pos.row * GRID_SIZE)
  });

  const position = gridToPixels(gridPos);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;

    const rect = iconRef.current.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    originalPosRef.current = { ...gridPos };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) {
      setIsDragging(true);
    }

    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;

    if (iconRef.current) {
      iconRef.current.style.left = newX + 'px';
      iconRef.current.style.top = newY + 'px';
    }
  };

  const handleMouseUp = (e) => {
    if (isDragging) {
      setIsDragging(false);

      const rect = iconRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const targetGrid = {
        col: Math.round((centerX - ICON_PADDING) / GRID_SIZE),
        row: Math.round((centerY - ICON_PADDING) / GRID_SIZE)
      };

      onMove(app.id, originalPosRef.current, targetGrid);
    }

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleClick = (e) => {
    if (!e.ctrlKey) {
      // Deselect other icons (handled by parent)
    }
    setIsSelected(!isSelected);
  };

  return (
    <div
      ref={iconRef}
      className={`desktop-icon ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      data-app={app.id}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={() => onDoubleClick(app.id)}
    >
      <div className="icon-image" style={{ fontSize: '48px' }}>
        {app.icon}
      </div>
      <div className="icon-label">{app.name}</div>
    </div>
  );
};

export default DesktopIcon;
