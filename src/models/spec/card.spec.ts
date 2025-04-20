import { Card, Rank, Suit } from '../card';

describe('Card', () => {
  let card: Card;
  beforeEach(() => {
    card = new Card(Suit.Spades, Rank.A);
  });

  it('should create a card with the given properties', () => {
    expect(card.suit).toBe('spades');
    expect(card.rank).toBe(1);
    expect(card.isFaceUp).toBe(false);
  });

  it('should create a card with face up property', () => {
    const card2 = new Card(Suit.Diamonds, Rank.K, true);
    expect(card2.isFaceUp).toBe(true);
  });

  it('should flip the card face up and down', () => {
    let isFaceUp = card.flip();
    expect(isFaceUp).toBe(true);
    expect(card.isFaceUp).toBe(true);

    isFaceUp = card.flip();
    expect(isFaceUp).toBe(false);
    expect(card.isFaceUp).toBe(false);
  });

  it('should return true when two cards have equal rank and suit', () => {
    const card2 = new Card(Suit.Spades, Rank.A, true);
    expect(card.equals(card2)).toBe(true);
  });

  it('should return false when two cards have different suit', () => {
    const card2 = new Card(Suit.Diamonds, Rank.A);
    expect(card.equals(card2)).toBe(false);
  });

  it('should return false when two cards have different rank', () => {
    const card2 = new Card(Suit.Spades, Rank.Two);
    expect(card.equals(card2)).toBe(false);
  });
});
