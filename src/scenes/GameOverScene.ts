import Phaser from 'phaser';
import { StorageSystem } from '../systems/StorageSystem';
import { PlayablesSystem } from '../systems/PlayablesSystem';

export class GameOverScene extends Phaser.Scene {
  private score: number = 0;
  private bestScore: number = 0;
  private isNewRecord: boolean = false;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { score: number; bestScore: number; isNewRecord: boolean }): void {
    this.score = data.score || 0;
    this.bestScore = data.bestScore || 0;
    this.isNewRecord = data.isNewRecord || false;
  }

  create(): void {
    PlayablesSystem.sendScore(this.score);
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    const overlay = this.add.rectangle(
      0, 0,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000, 0.7
    ).setOrigin(0);

    const gameOverText = this.add.text(centerX, centerY - 80, 'GAME OVER', {
      fontSize: '44px',
      fontFamily: 'Arial, sans-serif',
      color: '#e94560',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setScale(0);

    this.tweens.add({
      targets: gameOverText,
      scale: 1,
      duration: 400,
      ease: 'Back.easeOut'
    });

    const scoreText = this.add.text(centerX, centerY, `SCORE: ${this.score}`, {
      fontSize: '28px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff'
    }).setOrigin(0.5).setAlpha(0);

    const bestText = this.add.text(centerX, centerY + 40, `BEST: ${this.bestScore}`, {
      fontSize: '22px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffd700'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: [scoreText, bestText],
      alpha: 1,
      duration: 400,
      delay: 300
    });

    if (this.isNewRecord) {
      const newRecordText = this.add.text(centerX, centerY + 80, 'NEW RECORD!', {
        fontSize: '22px',
        fontFamily: 'Arial, sans-serif',
        color: '#f1c40f',
        fontStyle: 'bold'
      }).setOrigin(0.5).setAlpha(0).setScale(0.8);

      this.tweens.add({
        targets: newRecordText,
        alpha: 1,
        scale: 1.2,
        duration: 600,
        ease: 'Elastic.easeOut',
        delay: 400
      });
    }

    this.createButton(centerX, centerY + 140, 'TRY AGAIN', () => {
      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.time.delayedCall(200, () => {
        this.scene.start('GameScene');
      });
    });

    this.createButton(centerX, centerY + 200, 'MAIN MENU', () => {
      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.time.delayedCall(200, () => {
        this.scene.start('MenuScene');
      });
    });
  }

  private createButton(x: number, y: number, text: string, callback: () => void): void {
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(0x0f3460, 1);
    bg.fillRoundedRect(-80, -25, 160, 50, 25);
    bg.lineStyle(2, 0x533483, 1);
    bg.strokeRoundedRect(-80, -25, 160, 50, 25);

    const label = this.add.text(0, 0, text, {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    container.add([bg, label]);
    container.setSize(160, 50);
    container.setInteractive({ useHandCursor: true });

    container.on('pointerdown', () => {
      this.tweens.add({
        targets: container,
        scale: 0.92,
        duration: 60,
        yoyo: true,
        onComplete: callback
      });
    });

    container.on('pointerover', () => {
      this.tweens.add({
        targets: container,
        scale: 1.05,
        duration: 100
      });
    });

    container.on('pointerout', () => {
      this.tweens.add({
        targets: container,
        scale: 1,
        duration: 100
      });
    });
  }
}
