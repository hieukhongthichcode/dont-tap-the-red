import Phaser from 'phaser';

export class Target {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private graphics: Phaser.GameObjects.Graphics;
  private isRed: boolean;
  private spawnTime: number;
  private isDestroyed: boolean;
  private lifetime: number;
  private timeoutEvent: Phaser.Time.TimerEvent | null;
  private onMiss: () => void;
  private onTap: (isRed: boolean, reactionTime: number) => void;
  private radius: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    isRed: boolean,
    radius: number,
    lifetime: number,
    onMiss: () => void,
    onTap: (isRed: boolean, reactionTime: number) => void
  ) {
    this.scene = scene;
    this.isRed = isRed;
    this.radius = radius;
    this.lifetime = lifetime;
    this.onMiss = onMiss;
    this.onTap = onTap;
    this.isDestroyed = false;
    this.timeoutEvent = null;
    this.spawnTime = scene.time.now;

    this.container = scene.add.container(x, y);
    this.graphics = scene.add.graphics();
    this.container.add(this.graphics);

    this.draw();

    this.container.setSize(radius * 2, radius * 2);
    this.container.setInteractive({ useHandCursor: !isRed });

    this.container.on('pointerdown', () => {
      const pointer = scene.input.activePointer;
      this.handleTap(pointer);
    });

    this.spawn();
    this.startTimeout();
  }

  private draw(): void {
    this.graphics.clear();
    const color = this.isRed ? 0xe94560 : 0x2ecc71;
    this.graphics.fillStyle(color, 1);
    this.graphics.fillCircle(0, 0, this.radius);
    this.graphics.fillStyle(0xffffff, 0.2);
    this.graphics.fillCircle(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.4);
  }

  private spawn(): void {
    this.container.setScale(0.7);
    this.container.setAlpha(0);

    this.scene.tweens.add({
      targets: this.container,
      scale: 1,
      alpha: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });
  }

  private startTimeout(): void {
    this.timeoutEvent = this.scene.time.delayedCall(this.lifetime, () => {
      if (!this.isDestroyed) {
        this.destroy();
        this.onMiss();
      }
    });
  }

  private handleTap(_pointer: Phaser.Input.Pointer): void {
    if (this.isDestroyed) return;

    const reactionTime = this.scene.time.now - this.spawnTime;
    this.destroy();
    this.onTap(this.isRed, reactionTime);
  }

  destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    if (this.timeoutEvent) {
      this.timeoutEvent.remove();
      this.timeoutEvent = null;
    }

    this.scene.tweens.add({
      targets: this.container,
      scale: 1.3,
      alpha: 0,
      duration: 150,
      ease: 'Power2',
      onComplete: () => {
        if (this.container && this.container.active) {
          this.container.destroy();
        }
      }
    });
  }

  getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  isRedTarget(): boolean {
    return this.isRed;
  }
}
