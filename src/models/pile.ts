import { CardNotFoundError, PileEmptyError } from '../errors';
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

  constructor(cards: Card[] = []) {
    this._cards = cards;
  }

  peek(): Card {
    if (this.isEmpty) {
      throw new PileEmptyError('peek');
    }
    return this._cards[this.size - 1].copy();
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

  addPile(pile: Pile) {
    this._cards.push(...pile.cards);
  }

  splitAt(card: Card): Pile {
    const index = this._cards.findIndex((c) => c.equals(card));
    if (index === -1) {
      throw new CardNotFoundError('Cannot split: card not found in pile.');
    }
    return new Pile(this._cards.splice(index));
  }
}
