import { Game } from './core/Game';

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!canvas) {
        throw new Error('Canvas element not found');
    }

    const game = new Game(canvas);
    game.init();
    game.start();
});