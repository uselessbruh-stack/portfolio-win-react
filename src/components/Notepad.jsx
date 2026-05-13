import React, { useState, useRef, useEffect } from 'react';
import './Notepad.css';
import Dialog from './Dialog';

const Notepad = () => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('Untitled.txt');
  const [isModified, setIsModified] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [dialog, setDialog] = useState({ isOpen: false, type: 'alert', title: '', message: '', onConfirm: null });
  const textareaRef = useRef(null);

  useEffect(() => {
    // Load from localStorage if exists
    const saved = localStorage.getItem('notepad-content');
    if (saved) {
      setContent(saved);
    }
  }, []);

  useEffect(() => {
    // Auto-save to localStorage
    if (content) {
      localStorage.setItem('notepad-content', content);
    }
  }, [content]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  const handleNew = () => {
    if (isModified && content.trim()) {
      setDialog({
        isOpen: true,
        type: 'confirm',
        title: 'Notepad',
        message: 'Do you want to save changes before creating a new file?',
        onConfirm: () => {
          handleSave();
          setContent('');
          setFileName('Untitled.txt');
          setIsModified(false);
        },
        onCancel: () => {
          setContent('');
          setFileName('Untitled.txt');
          setIsModified(false);
        }
      });
    } else {
      setContent('');
      setFileName('Untitled.txt');
      setIsModified(false);
    }
  };

  const handleOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setContent(event.target.result);
          setFileName(file.name);
          setIsModified(false);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    setIsModified(false);
  };

  const handleSaveAs = () => {
    setDialog({
      isOpen: true,
      type: 'prompt',
      title: 'Save As',
      message: 'Enter file name:',
      defaultValue: fileName,
      inputPlaceholder: 'filename.txt',
      onConfirm: (newName) => {
        if (newName) {
          setFileName(newName.endsWith('.txt') ? newName : `${newName}.txt`);
          setTimeout(() => handleSave(), 100);
        }
      }
    });
  };

  const handleUndo = () => {
    document.execCommand('undo', false, null);
  };

  const handleRedo = () => {
    document.execCommand('redo', false, null);
  };

  const handleCopy = () => {
    textareaRef.current.focus();
    document.execCommand('copy');
  };

  const handleCut = () => {
    textareaRef.current.focus();
    document.execCommand('cut');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      setContent(newContent);
      setIsModified(true);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const handleSelectAll = () => {
    textareaRef.current.select();
  };

  const handleFind = () => {
    setDialog({
      isOpen: true,
      type: 'prompt',
      title: 'Find',
      message: 'Find:',
      inputPlaceholder: 'Enter text to find',
      onConfirm: (searchTerm) => {
        if (searchTerm) {
          const index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
          if (index !== -1) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(index, index + searchTerm.length);
          } else {
            setDialog({
              isOpen: true,
              type: 'alert',
              title: 'Notepad',
              message: 'Text not found',
              onConfirm: () => { }
            });
          }
        }
      }
    });
  };

  const handleReplace = () => {
    setDialog({
      isOpen: true,
      type: 'prompt',
      title: 'Replace',
      message: 'Find:',
      inputPlaceholder: 'Enter text to find',
      onConfirm: (searchTerm) => {
        if (searchTerm) {
          setDialog({
            isOpen: true,
            type: 'prompt',
            title: 'Replace',
            message: 'Replace with:',
            inputPlaceholder: 'Enter replacement text',
            onConfirm: (replaceTerm) => {
              if (replaceTerm !== null) {
                const newContent = content.replace(new RegExp(searchTerm, 'g'), replaceTerm);
                setContent(newContent);
                setIsModified(true);
              }
            }
          });
        }
      }
    });
  };

  const getStats = () => {
    const chars = content.length;
    const charsNoSpaces = content.replace(/\s/g, '').length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const lines = content.split('\n').length;
    return { chars, charsNoSpaces, words, lines };
  };

  const stats = getStats();

  return (
    <div className="notepad-container">
      <div className="notepad-menubar">
        <div className="notepad-menu">
          <div className="notepad-menu-item">
            <button className="notepad-menu-btn">File ▼</button>
            <div className="notepad-dropdown">
              <button onClick={handleNew}>New (Ctrl+N)</button>
              <button onClick={handleOpen}>Open (Ctrl+O)</button>
              <button onClick={handleSave}>Save (Ctrl+S)</button>
              <button onClick={handleSaveAs}>Save As</button>
            </div>
          </div>
          <div className="notepad-menu-item">
            <button className="notepad-menu-btn">Edit ▼</button>
            <div className="notepad-dropdown">
              <button onClick={handleUndo}>Undo (Ctrl+Z)</button>
              <button onClick={handleRedo}>Redo (Ctrl+Y)</button>
              <hr />
              <button onClick={handleCut}>Cut (Ctrl+X)</button>
              <button onClick={handleCopy}>Copy (Ctrl+C)</button>
              <button onClick={handlePaste}>Paste (Ctrl+V)</button>
              <hr />
              <button onClick={handleSelectAll}>Select All (Ctrl+A)</button>
              <button onClick={handleFind}>Find (Ctrl+F)</button>
              <button onClick={handleReplace}>Replace (Ctrl+H)</button>
            </div>
          </div>
          <div className="notepad-menu-item">
            <button className="notepad-menu-btn">View ▼</button>
            <div className="notepad-dropdown">
              <button onClick={() => setFontSize(f => Math.max(8, f - 2))}>Zoom Out</button>
              <button onClick={() => setFontSize(f => Math.min(32, f + 2))}>Zoom In</button>
              <button onClick={() => setFontSize(14)}>Reset Zoom</button>
              <hr />
              <button onClick={() => setWordWrap(!wordWrap)}>
                {wordWrap ? '✓' : ''} Word Wrap
              </button>
              <button onClick={() => setShowStats(!showStats)}>
                {showStats ? '✓' : ''} Status Bar
              </button>
            </div>
          </div>
        </div>
        <div className="notepad-filename">
          {fileName}{isModified ? ' *' : ''}
        </div>
      </div>

      <textarea
        ref={textareaRef}
        className="notepad-textarea"
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing..."
        style={{
          fontSize: `${fontSize}px`,
          whiteSpace: wordWrap ? 'pre-wrap' : 'pre'
        }}
        spellCheck={false}
      />

      {showStats && (
        <div className="notepad-statusbar">
          <span>Lines: {stats.lines}</span>
          <span>Words: {stats.words}</span>
          <span>Characters: {stats.chars}</span>
          <span>Characters (no spaces): {stats.charsNoSpaces}</span>
        </div>
      )}

      <Dialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog({ ...dialog, isOpen: false })}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
        defaultValue={dialog.defaultValue}
        inputPlaceholder={dialog.inputPlaceholder}
      />
    </div>
  );
};

export default Notepad;
