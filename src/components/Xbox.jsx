import React from 'react';
import './Xbox.css';
import Dialog from './Dialog';

const games = [
  { id: 1, icon: '🐦', name: 'Flappy Bird', description: 'Click to play', url: import.meta.env.VITE_FLAPPY_BIRD_URL },
  { id: 2, icon: '🐔', name: 'Crossy Road', description: 'Click to play', url: import.meta.env.VITE_CROSSY_ROAD_URL },
  { id: 3, icon: '🐍', name: 'Snake Game', description: 'Click to play', url: import.meta.env.VITE_SNAKE_GAME_URL },
  { id: 4, icon: '🎰', name: 'Game Slot 4', description: 'Coming Soon', url: null },
  { id: 5, icon: '🎪', name: 'Game Slot 5', description: 'Coming Soon', url: null },
  { id: 6, icon: '🎨', name: 'Game Slot 6', description: 'Coming Soon', url: null },
];

const Xbox = ({ onGameOpen }) => {
  const [dialog, setDialog] = React.useState({ isOpen: false, type: 'alert', title: '', message: '', onConfirm: null });

  const handleGameClick = (game) => {
    if (game.url) {
      onGameOpen(game);
    } else {
      setDialog({
        isOpen: true,
        type: 'alert',
        title: 'Xbox',
        message: `${game.name} - Coming Soon!`,
        onConfirm: () => { }
      });
    }
  };

  return (
    <div className="games-grid">
      {games.map((game) => (
        <div
          key={game.id}
          className="game-card"
          onClick={() => handleGameClick(game)}
        >
          <div className="game-icon">{game.icon}</div>
          <h3>{game.name}</h3>
          <p>{game.description}</p>
        </div>
      ))}

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

export default Xbox;
