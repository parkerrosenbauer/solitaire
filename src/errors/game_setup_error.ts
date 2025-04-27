export class GameSetupError extends Error {
  constructor(message: string) {
    super('Game setup failed: ' + message);
    this.name = 'GameSetupError';
  }
}
