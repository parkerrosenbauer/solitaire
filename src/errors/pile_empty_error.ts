export class PileEmptyError extends Error {
  constructor() {
    super('Cannot draw: pile is empty.');
    this.name = 'PileEmptyError';
  }
}
