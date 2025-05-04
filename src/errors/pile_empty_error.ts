export class PileEmptyError extends Error {
  constructor(action: String) {
    super(`Cannot ${action}: pile is empty.`);
    this.name = 'PileEmptyError';
  }
}
