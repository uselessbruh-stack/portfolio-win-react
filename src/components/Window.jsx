import React, { useRef, useEffect } from 'react';
import './Window.css';

const Window = ({
  id,
  app,
  position,
  size,
  isActive,
  isMinimized,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  children
}) => {
  const windowRef = useRef(null);
  const headerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const header = headerRef.current;
    const windowEl = windowRef.current;
    if (!header || !windowEl) return;

    const handleMouseDown = (e) => {
      if (e.target.closest('.window-control')) return;
      if (isMaximized) return;

      e.preventDefault();
      isDraggingRef.current = true;
      const rect = windowEl.getBoundingClientRect();
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'move';

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;

      const newX = Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragOffsetRef.current.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffsetRef.current.y));

      // Update DOM directly for smooth dragging
      windowEl.style.left = `${newX}px`;
      windowEl.style.top = `${newY}px`;
    };

    const handleMouseUp = (e) => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';

      // Update React state only once when drag ends
      const newX = Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragOffsetRef.current.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffsetRef.current.y));
      onMove(id, { x: newX, y: newY });

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    header.addEventListener('mousedown', handleMouseDown);

    return () => {
      header.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id, onMove, isMaximized]);

  const handleWindowClick = () => {
    if (!isActive) {
      onFocus(id);
    }
  };

  if (isMinimized) {
    return null;
  }

  const windowStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: isMaximized ? '100vw' : `${size.width}px`,
    height: isMaximized ? 'calc(100vh - 48px)' : `${size.height}px`,
    zIndex: zIndex,
    ...(isMaximized && {
      left: 0,
      top: 0,
      borderRadius: 0
    })
  };

  return (
    <div
      ref={windowRef}
      className={`window ${isActive ? 'active' : ''} ${isMaximized ? 'maximized' : ''}`}
      style={windowStyle}
      data-app={id}
      onMouseDown={handleWindowClick}
    >
      <div ref={headerRef} className="window-header">
        <div className="window-title">
          <span className="window-title-icon">{app.icon}</span>
          <span>{app.name}</span>
        </div>
        <div className="window-controls">
          <button
            className="window-control minimize"
            onClick={() => onMinimize(id)}
            title="Minimize"
          >
            ─
          </button>
          <button
            className="window-control maximize"
            onClick={() => onMaximize(id)}
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? '❐' : '□'}
          </button>
          <button
            className="window-control close"
            onClick={() => onClose(id)}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="window-content">
        {children}
      </div>
    </div>
  );
};

export default Window;
