import { DeckEmptyError } from '../errors';
import { Card, Rank, Suit } from './card';

export class Deck {
  private _cards: Card[];
  private readonly _initialCards: Card[];

  get cards(): Card[] {
    return [...this._cards];
  }

  get size(): number {
    return this._cards.length;
  }

  get isEmpty(): boolean {
    return this.size < 1;
  }

  get peek(): Card | undefined {
    return this._cards[this.size - 1];
  }

  constructor(cards: Card[]) {
    this._cards = cards;
    this._initialCards = [...cards];
  }

  shuffle() {
    for (let i = this.size - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
    }
  }

  draw(): Card {
    if (this.isEmpty) {
      throw new DeckEmptyError();
    }
    return this._cards.pop()!;
  }

  addCard(card: Card) {
    this._cards.push(card);
  }

  reset(cards?: Card[]) {
    this._cards = cards ?? [...this._initialCards];
  }
}
