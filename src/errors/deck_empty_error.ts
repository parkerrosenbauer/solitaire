export class DeckEmptyError extends Error {
  constructor() {
    super('Cannot draw: deck is empty.');
    this.name = 'DeckEmptyError';
  }
}
