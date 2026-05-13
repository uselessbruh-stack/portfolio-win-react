import React, { useState, useEffect } from 'react';
import './Portfolio.css';

const portfolioUrls = [
  process.env.REACT_APP_PORTFOLIO_URL_1,
  process.env.REACT_APP_PORTFOLIO_URL_2
].filter(Boolean);

const Portfolio = () => {
  const [portfolioUrl] = useState(() => {
    // Pick random portfolio URL on mount
    return portfolioUrls[Math.floor(Math.random() * portfolioUrls.length)];
  });

  return (
    <div className="portfolio-container">
      <iframe
        src={portfolioUrl}
        title="Portfolio"
        className="portfolio-iframe"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default Portfolio;
