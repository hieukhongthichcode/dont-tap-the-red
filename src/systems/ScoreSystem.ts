export class ScoreSystem {
  private score: number = 0;
  private comboStreak: number = 0;

  getScore(): number {
    return this.score;
  }

  getMultiplier(): number {
    return Math.floor(this.comboStreak / 5) + 1;
  }

  getComboStreak(): number {
    return this.comboStreak;
  }

  addScore(): number {
    this.comboStreak++;
    const multiplier = this.getMultiplier();
    this.score += multiplier;
    return multiplier;
  }

  addBonus(points: number): void {
    this.score += points;
  }

  resetCombo(): void {
    this.comboStreak = 0;
  }

  reset(): void {
    this.score = 0;
    this.resetCombo();
  }
}
