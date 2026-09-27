export class PlayablesSystem {
  private static isFirstFrameReadyCalled = false;
  private static isGameReadyCalled = false;

  static isAvailable(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof (window as any).ytgame !== 'undefined' &&
      !!(window as any).ytgame.game
    );
  }

  private static getGameApi(): any {
    if (!this.isAvailable()) return null;
    return (window as any).ytgame.game;
  }

  static safeCall(methodName: string, ..._args: unknown[]): void {
    try {
      const gameApi = this.getGameApi();
      if (!gameApi || typeof gameApi[methodName] !== 'function') return;

      gameApi[methodName](..._args);
    } catch {
      // Silently ignore Playables API errors in local mode
    }
  }

  static markFirstFrameReady(): void {
    if (this.isFirstFrameReadyCalled) return;
    this.isFirstFrameReadyCalled = true;
    this.safeCall('firstFrameReady');
  }

  static markGameReady(): void {
    if (this.isGameReadyCalled) return;
    this.isGameReadyCalled = true;
    this.safeCall('gameReady');
  }

  static reset(): void {
    this.isFirstFrameReadyCalled = false;
    this.isGameReadyCalled = false;
  }

  static sendScore(score: number): void {
    try {
      if (typeof window === 'undefined') return;
      const ytgame = (window as any).ytgame;
      if (!ytgame || !ytgame.engagement || typeof ytgame.engagement.sendScore !== 'function') return;

      const safeScore = Math.trunc(score);
      ytgame.engagement.sendScore({ value: safeScore }).catch(() => {
        // ignore rejected promise in local/unsupported environments
      });
    } catch {
      // ignore direct access errors in local mode
    }
  }
}
