import { Pile } from '../../core/pile/pile';
import { FACE_DOWN } from '../../utils/card.constants';
import { Card, Suit, Rank, Color } from '../card';

describe('Pile', () => {
  const cardPile = [
    new Card(Suit.Clubs, Rank.A, Color.Black),
    new Card(Suit.Diamonds, Rank.Ten, Color.Red),
  ];

  let emptyPile: Pile;
  let pile: Pile;

  beforeEach(() => {
    emptyPile = new Pile();
    pile = new Pile([...cardPile]);
  });

  it('should initialize with an empty card set if none provided', () => {
    expect(emptyPile.size).toBe(0);
  });

  it('should initialize with the provided cards', () => {
    expect(pile.size).toBe(cardPile.length);
    expect(pile.cards).toEqual(cardPile);
  });

  it('should initialize with all cards provided', () => {
    emptyPile.cards = [...cardPile];
    expect(emptyPile.size).toBe(2);
    expect(emptyPile.cards).toEqual(cardPile);
  });

  describe('peek', () => {
    it('should return the last card of the pile when peeking', () => {
      expect(pile.peek()).toEqual(cardPile[cardPile.length - 1]);
    });

    it('should throw an error when peeking at an empty pile', () => {
      expect(() => emptyPile.peek()).toThrow('Cannot peek: pile is empty.');
    });
  });

  describe('draw', () => {
    it('should draw last card from the deck', () => {
      const card = pile.draw();
      expect(card.equals(cardPile[cardPile.length - 1])).toEqual(true);
      expect(pile.size).toBe(1);
    });

    it('should throw an error when drawing from an empty pile', () => {
      expect(() => emptyPile.draw()).toThrow('Cannot draw: pile is empty.');
    });
  });

  describe('addCard', () => {
    it('should add a card to the top of the pile', () => {
      const card = new Card(Suit.Hearts, Rank.Three, Color.Red);
      pile.addCard(card);
      expect(pile.peek().equals(card)).toBe(true);
      expect(pile.size).toBe(3);
    });

    it('should add a card to an empty pile', () => {
      const card = new Card(Suit.Hearts, Rank.Three, Color.Red);
      emptyPile.addCard(card);
      expect(emptyPile.peek().equals(card)).toBe(true);
      expect(emptyPile.size).toBe(1);
    });
  });

  describe('addPile', () => {
    it('should add another pile to the top of the pile', () => {
      const newPile = new Pile([
        new Card(Suit.Spades, Rank.K, Color.Black),
        new Card(Suit.Hearts, Rank.Q, Color.Red),
      ]);
      pile.addPile(newPile);
      expect(pile.size).toBe(4);
      expect(pile.peek().equals(newPile.peek())).toBe(true);
    });

    it('should add an empty pile to the pile', () => {
      const newPile = new Pile([]);
      pile.addPile(newPile);
      expect(pile.size).toBe(2);
    });
  });

  describe('splitAt', () => {
    it('should split the pile at the specified card', () => {
      const card = new Card(Suit.Hearts, Rank.Three, Color.Red);
      pile.addCard(card);
      const splitCards = pile.splitAt(cardPile[1]);
      expect(splitCards.cards).toEqual([cardPile[1], card]);
      expect(splitCards.size).toBe(2);
      expect(pile.size).toBe(1);
      expect(pile.peek().equals(cardPile[0])).toBe(true);
    });

    it('should throw an error if the card is not in the pile', () => {
      const card = new Card(Suit.Hearts, Rank.Three, Color.Red);
      expect(() => pile.splitAt(card)).toThrow(
        'Cannot split: card not found in pile.',
      );
    });
  });

  describe('serialize', () => {
    it('should serialize and deserialize the pile', () => {
      const serialized = pile.serialize();
      const deserialized = Pile.deserialize(serialized);
      expect(deserialized).toEqual(pile);
    });
  });
});
