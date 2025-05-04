export class GamePlayError extends Error {
  constructor(message: string) {
    super('Game play error: ' + message);
    this.name = 'GamePlayError';
  }
}
