import { Color } from './color.enum';
import { Rank, rankToString } from './rank.enum';
import { SerializedCard } from './card.serialize';
import { Suit } from './suit.enum';

export class Card {
  public readonly suit: Suit;
  public readonly rank: Rank;
  public readonly color: Color;
  private _faceUp: boolean;

  get isFaceUp(): boolean {
    return this._faceUp;
  }

  constructor(suit: Suit, rank: Rank, color: Color, faceUp: boolean = false) {
    this.suit = suit;
    this.rank = rank;
    this.color = color;
    this._faceUp = faceUp;
  }

  flip(): boolean {
    this._faceUp = !this._faceUp;
    return this._faceUp;
  }

  equals(card: Card): boolean {
    return (
      this.suit === card.suit &&
      this.rank === card.rank &&
      this.color === card.color
    );
  }

  copy(): Card {
    return new Card(this.suit, this.rank, this.color, this._faceUp);
  }

  toString(): string {
    const rankString = rankToString[this.rank] ?? this.rank.toString();
    return `${this.color} ${rankString} of ${this.suit}${this.isFaceUp ? ' (face up)' : ' (face down)'}`;
  }

  serialize(): SerializedCard {
    return {
      suit: this.suit,
      rank: this.rank,
      color: this.color,
      faceUp: this._faceUp,
    };
  }

  static deserialize(data: SerializedCard): Card {
    return new Card(data.suit, data.rank, data.color, data.faceUp);
  }
}
