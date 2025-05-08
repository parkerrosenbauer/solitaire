import { Card } from './card';
import { Color } from './color.enum';
import { Rank } from './rank.enum';
import { Suit } from './suit.enum';

describe('Card', () => {
  let card: Card;
  beforeEach(() => {
    card = new Card(Suit.Spades, Rank.A, Color.Black);
  });

  it('should create a card with the given properties', () => {
    expect(card.suit).toBe('spades');
    expect(card.rank).toBe(1);
    expect(card.isFaceUp).toBe(false);
  });

  it('should create a card with face up property', () => {
    const card2 = new Card(Suit.Diamonds, Rank.K, Color.Red, true);
    expect(card2.isFaceUp).toBe(true);
  });

  describe('flip', () => {
    it('should flip a face down card face up', () => {
      let isFaceUp = card.flip();
      expect(isFaceUp).toBe(true);
      expect(card.isFaceUp).toBe(true);
    });

    it('should flip a face up card face down', () => {
      card.flip(); // Flip it face up
      let isFaceUp = card.flip();
      expect(isFaceUp).toBe(false);
      expect(card.isFaceUp).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true when two cards have equal rank and suit', () => {
      const card2 = new Card(Suit.Spades, Rank.A, Color.Black, true);
      expect(card.equals(card2)).toBe(true);
    });

    it('should return false when two cards have different suit', () => {
      const card2 = new Card(Suit.Diamonds, Rank.A, Color.Red);
      expect(card.equals(card2)).toBe(false);
    });

    it('should return false when two cards have different rank', () => {
      const card2 = new Card(Suit.Spades, Rank.Two, Color.Black);
      expect(card.equals(card2)).toBe(false);
    });
  });

  describe('copy', () => {
    it('should create a copy of the card', () => {
      const card2 = card.copy();
      expect(card2).not.toBe(card);
      expect(card2.equals(card)).toBe(true);
    });
  });
});
