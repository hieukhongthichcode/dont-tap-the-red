import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';
import { PlayablesSystem } from './systems/PlayablesSystem';

const game = new Phaser.Game(gameConfig);

window.addEventListener('beforeunload', () => {
  game.destroy(true);
});
