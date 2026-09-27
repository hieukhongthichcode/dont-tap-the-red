export class DifficultySystem {
  private score: number = 0;

  getDifficultyParams(): {
    radius: number;
    redChance: number;
    lifetime: number;
    edgeChance: number;
    level: number;
  } {
    const baseRadius = 45;
    const minRadius = 25;
    const baseRedChance = 0.1;
    const maxRedChance = 0.4;
    const baseLifetime = 1500;
    const minLifetime = 600;
    const baseEdgeChance = 0.1;
    const maxEdgeChance = 0.5;

    const difficultyFactor = Math.min(this.score / 100, 1);

    const radius = Math.max(minRadius, baseRadius - (baseRadius - minRadius) * difficultyFactor);
    const redChance = baseRedChance + (maxRedChance - baseRedChance) * difficultyFactor;
    const lifetime = baseLifetime - (baseLifetime - minLifetime) * difficultyFactor;
    const edgeChance = baseEdgeChance + (maxEdgeChance - baseEdgeChance) * difficultyFactor;
    const level = Math.floor(this.score / 10) + 1;

    return {
      radius: Math.round(radius),
      redChance,
      lifetime: Math.round(lifetime),
      edgeChance,
      level
    };
  }

  updateScore(score: number): void {
    this.score = score;
  }
}
