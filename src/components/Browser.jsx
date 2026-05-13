import React, { useState, useRef } from 'react';
import './Browser.css';

const Browser = () => {
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showHome, setShowHome] = useState(true);
  const iframeRef = useRef(null);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const navigate = () => {
    const input = url.trim();
    if (!input) return;

    let targetUrl = input;

    // Check if it's a URL
    if (input.startsWith('http://') || input.startsWith('https://')) {
      loadUrl(targetUrl);
    } else if (input.includes('.') && !input.includes(' ') && input.split('.').length >= 2) {
      targetUrl = 'https://' + input;
      loadUrl(targetUrl);
    } else {
      // Perform search
      performSearch(input);
    }
  };

  const loadUrl = (targetUrl) => {
    setCurrentUrl(targetUrl);
    setUrl(targetUrl);
    setShowHome(false);
    setSearchResults(null);
    updateHistory(targetUrl);
  };

  const performSearch = async (query) => {
    setUrl(query);
    setIsLoading(true);
    setShowHome(false);
    setSearchResults(null);

    try {
      const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`);
      const data = await response.json();

      let results = [];

      // Add Abstract if available
      if (data.Abstract && data.AbstractText) {
        results.push({
          title: data.Heading || query,
          url: data.AbstractURL,
          text: data.AbstractText
        });
      }

      // Add Related Topics
      if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        data.RelatedTopics.forEach(item => {
          if (item.Text && item.FirstURL) {
            results.push({
              title: item.Text.split(' - ')[0] || item.Text.substring(0, 80),
              url: item.FirstURL,
              text: item.Text
            });
          } else if (item.Topics) {
            item.Topics.forEach(topic => {
              if (topic.Text && topic.FirstURL) {
                results.push({
                  title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 80),
                  url: topic.FirstURL,
                  text: topic.Text
                });
              }
            });
          }
        });
      }

      setSearchResults({ query, results });
      updateHistory(`search:${query}`);
    } catch (error) {
      setSearchResults({ query, results: [], error: true });
    } finally {
      setIsLoading(false);
    }
  };

  const updateHistory = (newUrl) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const prevUrl = history[newIndex];

      if (prevUrl.startsWith('search:')) {
        const query = prevUrl.substring(7);
        setUrl(query);
        performSearch(query);
      } else {
        loadUrl(prevUrl);
      }
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextUrl = history[newIndex];

      if (nextUrl.startsWith('search:')) {
        const query = nextUrl.substring(7);
        setUrl(query);
        performSearch(query);
      } else {
        loadUrl(nextUrl);
      }
    }
  };

  const refresh = () => {
    if (currentUrl) {
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
    } else if (searchResults) {
      performSearch(searchResults.query);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      navigate();
    }
  };

  return (
    <div className="browser-container">
      <div className="browser-toolbar">
        <button
          className="browser-nav-btn"
          onClick={goBack}
          disabled={historyIndex <= 0}
          title="Back"
        >
          ←
        </button>
        <button
          className="browser-nav-btn"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          title="Forward"
        >
          →
        </button>
        <button
          className="browser-nav-btn"
          onClick={refresh}
          title="Refresh"
        >
          ⟳
        </button>
        <div className="browser-url-bar">
          <span className="browser-url-icon">🔍</span>
          <input
            type="text"
            className="browser-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search Google or type a URL"
          />
          <button className="browser-go-btn" onClick={navigate}>
            Search
          </button>
        </div>
      </div>

      <div className="browser-content">
        {showHome && (
          <div className="browser-home">
            <div className="browser-home-icon">🌐</div>
            <h2>Microsoft Edge</h2>
            <p>Start browsing by searching or entering a URL above</p>
          </div>
        )}

        {isLoading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Searching for "{searchResults?.query || url}"...</p>
          </div>
        )}

        {searchResults && !isLoading && (
          <div className="search-results">
            {searchResults.error ? (
              <div className="no-results">
                <div className="no-results-icon">⚠️</div>
                <h3>Search Error</h3>
                <p>Unable to perform search. Please try again.</p>
              </div>
            ) : searchResults.results.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No results found</h3>
                <p>Try different keywords or check your spelling</p>
              </div>
            ) : (
              <>
                <div className="search-header">
                  <div className="search-logo">
                    <span>🦆</span>
                    <span>DuckDuckGo</span>
                  </div>
                </div>
                <div className="search-stats">
                  About {searchResults.results.length} result{searchResults.results.length !== 1 ? 's' : ''}
                </div>
                {searchResults.results.map((result, index) => {
                  const domain = result.url ? new URL(result.url).hostname.replace('www.', '') : '';
                  const truncatedText = result.text.length > 160
                    ? result.text.substring(0, 160) + '...'
                    : result.text;

                  return (
                    <div key={index} className="result-item">
                      <a
                        href={result.url}
                        className="result-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {result.title}
                      </a>
                      <div className="result-url">{domain}</div>
                      <p className="result-desc">{truncatedText}</p>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {currentUrl && !searchResults && !showHome && (
          <iframe
            ref={iframeRef}
            className="browser-frame"
            src={currentUrl}
            title="Browser Content"
          />
        )}
      </div>
    </div>
  );
};

export default Browser;
