export class GameError extends Error {
  constructor(message: string) {
    super('Game error: ' + message);
    this.name = 'GameError';
  }
}
