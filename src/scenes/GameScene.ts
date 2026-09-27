import Phaser from 'phaser';
import { ScoreSystem } from '../systems/ScoreSystem';
import { DifficultySystem } from '../systems/DifficultySystem';
import { Target } from '../objects/Target';
import { StorageSystem } from '../systems/StorageSystem';

export class GameScene extends Phaser.Scene {
  private scoreSystem!: ScoreSystem;
  private difficultySystem!: DifficultySystem;
  private currentTarget: Target | null = null;
  private scoreText!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private bestText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private bestScore: number = 0;
  private isGameOver: boolean = false;
  private playableArea: { x: number; y: number; width: number; height: number } = {
    x: 0, y: 0, width: 0, height: 0
  };

  constructor() {
    super({ key: 'GameScene' });
  }

  init(): void {
    this.scoreSystem = new ScoreSystem();
    this.difficultySystem = new DifficultySystem();
    this.currentTarget = null;
    this.isGameOver = false;
    this.bestScore = StorageSystem.getBestScore();
  }

  create(): void {
    const cam = this.cameras.main;
    this.playableArea = {
      x: 40,
      y: 70,
      width: cam.width - 80,
      height: cam.height - 130
    };

    const topBg = this.add.graphics();
    topBg.fillStyle(0x16213e, 0.8);
    topBg.fillRect(0, 0, cam.width, 60);

    const bottomBg = this.add.graphics();
    bottomBg.fillStyle(0x16213e, 0.8);
    bottomBg.fillRect(0, cam.height - 40, cam.width, 40);

    this.scoreText = this.add.text(20, 15, 'SCORE: 0', {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff'
    });

    this.comboText = this.add.text(cam.width / 2, 15, 'COMBO x1', {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#f39c12'
    }).setOrigin(0.5, 0);

    this.bestText = this.add.text(cam.width - 20, 15, `BEST: ${this.bestScore}`, {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffd700'
    }).setOrigin(1, 0);

    this.levelText = this.add.text(cam.width / 2, cam.height - 20, 'LEVEL: 1', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#a0a0a0'
    }).setOrigin(0.5, 1);

    this.spawnTarget();
  }

  private spawnTarget(): void {
    if (this.isGameOver) return;

    const params = this.difficultySystem.getDifficultyParams();
    this.difficultySystem.updateScore(this.scoreSystem.getScore());

    const isRed = Math.random() < params.redChance;
    let x: number;
    let y: number;

    const nearEdge = Math.random() < params.edgeChance;

    if (nearEdge) {
      const edge = Math.floor(Math.random() * 4);
      const padding = params.radius + 10;

      switch (edge) {
        case 0:
          x = this.playableArea.x + padding + Math.random() * (this.playableArea.width - padding * 2);
          y = this.playableArea.y + padding;
          break;
        case 1:
          x = this.playableArea.x + this.playableArea.width - padding;
          y = this.playableArea.y + padding + Math.random() * (this.playableArea.height - padding * 2);
          break;
        case 2:
          x = this.playableArea.x + padding + Math.random() * (this.playableArea.width - padding * 2);
          y = this.playableArea.y + this.playableArea.height - padding;
          break;
        case 3:
          x = this.playableArea.x + padding;
          y = this.playableArea.y + padding + Math.random() * (this.playableArea.height - padding * 2);
          break;
        default:
          x = this.playableArea.x + params.radius + Math.random() * (this.playableArea.width - params.radius * 2);
          y = this.playableArea.y + params.radius + Math.random() * (this.playableArea.height - params.radius * 2);
      }
    } else {
      x = this.playableArea.x + params.radius + Math.random() * (this.playableArea.width - params.radius * 2);
      y = this.playableArea.y + params.radius + Math.random() * (this.playableArea.height - params.radius * 2);
    }

    this.currentTarget = new Target(
      this,
      x,
      y,
      isRed,
      params.radius,
      params.lifetime,
      () => this.handleMiss(),
      (targetIsRed, reactionTime) => this.handleTap(targetIsRed, reactionTime)
    );

    this.levelText.setText(`LEVEL: ${params.level}`);
  }

  private handleMiss(): void {
    if (this.isGameOver) return;

    this.scoreSystem.resetCombo();
    this.updateUI();
    this.spawnTarget();
  }

  private handleTap(isRed: boolean, reactionTime: number): void {
    if (this.isGameOver) return;

    if (isRed) {
      this.triggerGameOver();
    } else {
      if (reactionTime < 300) {
        this.showPerfect(reactionTime);
        this.scoreSystem.addBonus(5);
      }

      const points = this.scoreSystem.addScore();
      this.updateUI();

      const container = this.currentTarget?.getContainer();
      if (container) {
        this.createPopEffect(container.x, container.y);
      }

      this.currentTarget = null;
      this.time.delayedCall(120, () => this.spawnTarget());
    }
  }

  private showPerfect(_reactionTime: number): void {
    if (!this.currentTarget) return;

    const x = this.currentTarget.getContainer().x;
    const y = this.currentTarget.getContainer().y;

    const perfectText = this.add.text(x, y - 50, 'PERFECT!', {
      fontSize: '22px',
      fontFamily: 'Arial, sans-serif',
      color: '#f1c40f',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0).setScale(0.5);

    this.tweens.add({
      targets: perfectText,
      alpha: 1,
      scale: 1,
      y: y - 80,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: perfectText,
          alpha: 0,
          y: y - 120,
          duration: 300,
          onComplete: () => perfectText.destroy()
        });
      }
    });

    const floatText = this.add.text(x, y + 20, '+5', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#f1c40f',
      fontStyle: 'bold'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: floatText,
      alpha: 1,
      y: y - 30,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.tweens.add({
          targets: floatText,
          alpha: 0,
          duration: 300,
          onComplete: () => floatText.destroy()
        });
      }
    });
  }

  private createPopEffect(x: number, y: number): void {
    for (let i = 0; i < 6; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(0x2ecc71, 1);
      particle.fillCircle(0, 0, 4);
      particle.setPosition(x, y);

      const angle = (i / 6) * Math.PI * 2;
      const distance = 30 + Math.random() * 20;

      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  private updateUI(): void {
    this.scoreText.setText(`SCORE: ${this.scoreSystem.getScore()}`);
    this.comboText.setText(`COMBO x${this.scoreSystem.getMultiplier()}`);
    this.bestText.setText(`BEST: ${Math.max(this.bestScore, this.scoreSystem.getScore())}`);
  }

  private triggerGameOver(): void {
    this.isGameOver = true;

    const currentScore = this.scoreSystem.getScore();
    const oldBestScore = this.bestScore;
    const isNewRecord = currentScore > 0 && currentScore > oldBestScore;

    this.cameras.main.shake(200, 0.02);

    const flash = this.add.rectangle(
      0, 0,
      this.cameras.main.width,
      this.cameras.main.height,
      0xe94560, 0.5
    ).setOrigin(0).setAlpha(0);

    this.tweens.add({
      targets: flash,
      alpha: 0.4,
      duration: 100,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        flash.destroy();
        this.saveScore();
        this.scene.start('GameOverScene', {
          score: currentScore,
          bestScore: this.bestScore,
          isNewRecord
        });
      }
    });
  }

  private saveScore(): void {
    const currentScore = this.scoreSystem.getScore();
    if (currentScore > this.bestScore) {
      this.bestScore = currentScore;
      StorageSystem.setBestScore(this.bestScore);
    }
  }
}
