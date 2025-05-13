export class MoveRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MoveRequestError';
  }
}
