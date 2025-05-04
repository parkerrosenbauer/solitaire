export class GameRuleError extends Error {
  constructor(rule: string) {
    super('Game rule violated: ' + rule);
    this.name = 'GameRuleError';
  }
}
