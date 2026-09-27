import Phaser from 'phaser';
import { PlayablesSystem } from '../systems/PlayablesSystem';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      if (gameSize.width === 0 || gameSize.height === 0) {
        const parent = this.scale.parent;
        if (parent && parent.clientWidth > 0 && parent.clientHeight > 0) {
          this.scale.resize(parent.clientWidth, parent.clientHeight);
        }
      }
    });

    PlayablesSystem.markFirstFrameReady();
    this.scene.start('MenuScene');
  }
}
