import Phaser from 'phaser';
import { StorageSystem } from '../systems/StorageSystem';
import { PlayablesSystem } from '../systems/PlayablesSystem';

export class MenuScene extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;
  private playButton!: Phaser.GameObjects.Container;
  private bestScoreText!: Phaser.GameObjects.Text;
  private bestScore: number = 0;
  private hasMarkedReady = false;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    this.bestScore = StorageSystem.getBestScore();

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.titleText = this.add.text(centerX, centerY - 120, "DON'T TAP\nTHE RED", {
      fontSize: '44px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      align: 'center',
      stroke: '#e94560',
      strokeThickness: 4
    }).setOrigin(0.5).setScale(0).setAlpha(0);

    this.add.text(centerX, centerY - 20, 'How far can you get?', {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#a0a0a0'
    }).setOrigin(0.5);

    this.playButton = this.createButton(centerX, centerY + 60, 'PLAY', () => {
      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.time.delayedCall(200, () => {
        this.scene.start('GameScene');
      });
    });

    this.bestScoreText = this.add.text(centerX, centerY + 140, `BEST SCORE: ${this.bestScore}`, {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffd700'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: this.titleText,
      scale: 1,
      alpha: 1,
      duration: 600,
      ease: 'Back.easeOut'
    });

    this.tweens.add({
      targets: [this.bestScoreText],
      alpha: 1,
      duration: 400,
      delay: 300
    });

    if (!this.hasMarkedReady) {
      this.hasMarkedReady = true;
      PlayablesSystem.markGameReady();
    }
  }

  private createButton(x: number, y: number, text: string, callback: () => void): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(0x0f3460, 1);
    bg.fillRoundedRect(-80, -25, 160, 50, 25);
    bg.lineStyle(2, 0x533483, 1);
    bg.strokeRoundedRect(-80, -25, 160, 50, 25);

    const label = this.add.text(0, 0, text, {
      fontSize: '22px',
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

    return container;
  }
}
