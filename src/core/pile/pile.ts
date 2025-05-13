import { CardNotFoundError, PileEmptyError } from '../../errors';
import { Card } from '../card/card';
import { SerializedPile } from './pile.serialized';

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

  splitAt(cardIndex: number): Pile {
    if (this.isEmpty) {
      throw new PileEmptyError('splitAt');
    } else if (cardIndex < 0 || cardIndex >= this.size) {
      throw new CardNotFoundError(`Card index ${cardIndex} not found.`);
    }
    return new Pile(this._cards.splice(cardIndex));
  }

  copy(): Pile {
    return new Pile(this._cards.map((card) => card.copy()));
  }

  serialize(): SerializedPile {
    return {
      cards: this.cards.map((card) => card.serialize()),
    };
  }

  static deserialize(data: SerializedPile): Pile {
    return new Pile(data.cards.map((card) => Card.deserialize(card)));
  }
}
