export enum Suit {
  Spades = 'spades',
  Hearts = 'hearts',
  Diamonds = 'diamonds',
  Clubs = 'clubs',
}

export enum Rank {
  A = 1,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  J,
  Q,
  K,
}

const rankToString = {
  [Rank.A]: 'A',
  [Rank.J]: 'J',
  [Rank.Q]: 'Q',
  [Rank.K]: 'K',
};

export class Card {
  public readonly suit: Suit;
  public readonly rank: Rank;
  private _faceUp: boolean;

  get isFaceUp(): boolean {
    return this._faceUp;
  }

  constructor(suit: Suit, rank: Rank, faceUp: boolean = false) {
    this.suit = suit;
    this.rank = rank;
    this._faceUp = faceUp;
  }

  flip(): boolean {
    this._faceUp = !this._faceUp;
    return this._faceUp;
  }

  equals(card: Card): boolean {
    return this.suit === card.suit && this.rank === card.rank;
  }

  toString(): string {
    const rankString = rankToString[this.rank] ?? this.rank.toString();
    return `${rankString} of ${this.suit}${this.isFaceUp ? ' (face up)' : ' (face down)'}`;
  }
}
