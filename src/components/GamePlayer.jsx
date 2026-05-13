import React from 'react';
import './GamePlayer.css';

const GamePlayer = ({ gameUrl, gameName }) => {
  return (
    <div className="game-player">
      <iframe
        src={gameUrl}
        title={gameName}
        className="game-iframe"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default GamePlayer;
