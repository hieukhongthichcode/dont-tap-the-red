export class StorageSystem {
  private static readonly KEY = 'dont_tap_the_red_best_score';

  static getBestScore(): number {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? parseInt(data, 10) : 0;
    } catch {
      return 0;
    }
  }

  static setBestScore(score: number): void {
    try {
      localStorage.setItem(this.KEY, score.toString());
    } catch {
      // Ignore localStorage errors
    }
  }
}
