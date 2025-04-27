export class GameSetupError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super('Game setup failed: ' + message, options);
    this.name = 'GameSetupError';
  }
}
