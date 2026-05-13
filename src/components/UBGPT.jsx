import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './UBGPT.css';
import Dialog from './Dialog';

const UBGPT = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState(process.env.REACT_APP_GEMINI_API_KEY || '');
  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState({ isOpen: false, type: 'alert', title: '', message: '', onConfirm: null });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content, type) => {
    const newMessage = {
      id: Date.now(),
      type,
      content
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async () => {
    const message = input.trim();
    if (!message) return;

    addMessage(message, 'user');
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }]
        })
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        addMessage(aiResponse, 'assistant');
      } else if (data.error) {
        addMessage(`Error: ${data.error.message}`, 'assistant');
      } else {
        addMessage('Sorry, I couldn\'t generate a response. Please try again.', 'assistant');
      }
    } catch (error) {
      setIsLoading(false);
      addMessage(`Error: ${error.message}. Please check your API key and try again.`, 'assistant');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ubgpt-container">
      <div className="ubgpt-messages" id="ubgpt-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`ubgpt-message ${msg.type}`}>
            <div className="ubgpt-avatar">
              {msg.type === 'user' ? '👤' : '🤖'}
            </div>
            <div className="ubgpt-content">
              {msg.type === 'assistant' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline ? (
                        <pre className="code-block">
                          <div className="code-header">
                            <span className="code-language">{match ? match[1] : 'code'}</span>
                            <button
                              className="code-copy-btn"
                              onClick={() => {
                                navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                              }}
                            >
                              📋 Copy
                            </button>
                          </div>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className="inline-code" {...props}>
                          {children}
                        </code>
                      );
                    },
                    p({ children }) {
                      return <p className="markdown-p">{children}</p>;
                    },
                    ul({ children }) {
                      return <ul className="markdown-list">{children}</ul>;
                    },
                    ol({ children }) {
                      return <ol className="markdown-list">{children}</ol>;
                    },
                    blockquote({ children }) {
                      return <blockquote className="markdown-quote">{children}</blockquote>;
                    },
                    table({ children }) {
                      return <table className="markdown-table">{children}</table>;
                    },
                    a({ children, href }) {
                      return (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="markdown-link">
                          {children}
                        </a>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="ubgpt-message assistant">
            <div className="ubgpt-avatar">🤖</div>
            <div className="ubgpt-content">
              <p className="loading-dots">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ubgpt-input-area">
        <input
          type="text"
          id="ubgpt-input"
          className="ubgpt-input"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage} className="ubgpt-send-btn">Send</button>
      </div>

      <Dialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog({ ...dialog, isOpen: false })}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onConfirm={dialog.onConfirm}
      />
    </div>
  );
};

export default UBGPT;
