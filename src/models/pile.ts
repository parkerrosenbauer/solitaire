import { PileEmptyError } from '../errors';
import { Card } from './card';

export class Pile {
  private _cards: Card[];

  get cards(): Card[] {
    return [...this._cards];
  }

  set cards(cards: Card[]) {
    this._cards = cards;
  }

  get size(): number {
    return this._cards.length;
  }

  get isEmpty(): boolean {
    return this.size <= 0;
  }

  get peek(): Card {
    if (this.isEmpty) {
      throw new PileEmptyError('peek');
    }
    return this._cards[this.size - 1];
  }

  constructor(cards: Card[] = []) {
    this._cards = cards;
  }

  draw(): Card {
    if (this.isEmpty) {
      throw new PileEmptyError('draw');
    }
    return this._cards.pop()!;
  }

  addCard(card: Card) {
    this._cards.push(card);
  }
}
