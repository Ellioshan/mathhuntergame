import './style.css';
import { Game } from './game/Game';

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    // Create the game instance
    const game = new Game(app);
    
    // Initialize the game
    game.init();
  }
});
