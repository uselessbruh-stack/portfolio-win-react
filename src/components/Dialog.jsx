import React from 'react';
import './Dialog.css';

const Dialog = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'alert', // 'alert', 'confirm', 'prompt'
  onConfirm,
  onCancel,
  defaultValue = '',
  inputPlaceholder = ''
}) => {
  const [inputValue, setInputValue] = React.useState(defaultValue);

  React.useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue, isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (type === 'prompt') {
      onConfirm?.(inputValue);
    } else {
      onConfirm?.();
    }
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && type !== 'prompt') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="dialog-overlay" onClick={handleCancel}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="dialog-title">
          <span className="dialog-icon">
            {type === 'alert' && '⚠️'}
            {type === 'confirm' && '❓'}
            {type === 'prompt' && '✏️'}
          </span>
          <span>{title}</span>
        </div>

        <div className="dialog-content">
          <p>{message}</p>
          {type === 'prompt' && (
            <input
              type="text"
              className="dialog-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputPlaceholder}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirm();
                }
              }}
            />
          )}
        </div>

        <div className="dialog-buttons">
          {type === 'alert' && (
            <button className="dialog-btn dialog-btn-primary" onClick={handleConfirm} autoFocus>
              OK
            </button>
          )}
          {(type === 'confirm' || type === 'prompt') && (
            <>
              <button className="dialog-btn dialog-btn-primary" onClick={handleConfirm}>
                OK
              </button>
              <button className="dialog-btn" onClick={handleCancel}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
