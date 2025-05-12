import { Pile } from '../../core/pile/pile';
import { FACE_DOWN } from '../../utils/card.constants';
import { Card, Suit, Rank, Color } from '../card';

describe('Pile', () => {
  const cardPile = [FACE_DOWN.ACE_OF_CLUBS, FACE_DOWN.TEN_OF_DIAMONDS];

  let emptyPile: Pile;
  let pile: Pile;

  beforeEach(() => {
    emptyPile = new Pile();
    pile = new Pile([...cardPile]);
  });

  it('initializes with no cards if none provided', () => {
    expect(emptyPile.size).toBe(0);
  });

  it('initializes with the provided cards', () => {
    expect(pile.size).toBe(cardPile.length);
    expect(pile.cards).toEqual(cardPile);
  });

  it('updates cards to provided cards', () => {
    emptyPile.cards = [...cardPile];
    expect(emptyPile.size).toBe(2);
    expect(emptyPile.cards).toEqual(cardPile);
  });

  describe('peek', () => {
    it('returns copy of the last card', () => {
      expect(pile.peek()).toEqual(cardPile[cardPile.length - 1]);
      expect(pile.peek()).not.toBe(cardPile[cardPile.length - 1]);
    });

    it('throws when peeking at an empty pile', () => {
      expect(() => emptyPile.peek()).toThrow('Cannot peek: pile is empty.');
    });
  });

  describe('draw', () => {
    it('draws last card from the deck', () => {
      const card = pile.draw();
      expect(card.equals(cardPile[cardPile.length - 1])).toEqual(true);
      expect(pile.size).toBe(1);
    });

    it('throws when drawing from an empty pile', () => {
      expect(() => emptyPile.draw()).toThrow('Cannot draw: pile is empty.');
    });
  });

  describe('getMutableCard', () => {
    it('returns the mutable card at the specified index', () => {
      const card = pile.getMutableCard(0);
      expect(card.equals(cardPile[0])).toBe(true);
    });

    it('returns the reference, not a copy', () => {
      const card = pile.getMutableCard(0);
      expect(card).toBe(pile.cards[0]);
      expect(card.equals(cardPile[0])).toBe(true);
    });

    it('throws when getting a card from an empty pile', () => {
      expect(() => emptyPile.getMutableCard(0)).toThrow(
        'Cannot getMutableCard: pile is empty.',
      );
    });

    it('throws when getting a card at an invalid index', () => {
      expect(() => pile.getMutableCard(-1)).toThrow('Card index -1 not found.');
      expect(() => pile.getMutableCard(2)).toThrow('Card index 2 not found.');
    });
  });

  describe('addCard', () => {
    it('adds a card to the top of the pile', () => {
      const card = FACE_DOWN.ACE_OF_HEARTS;
      pile.addCard(card);
      expect(pile.peek().equals(card)).toBe(true);
      expect(pile.size).toBe(3);
    });

    it('adds a card to an empty pile', () => {
      const card = FACE_DOWN.ACE_OF_SPADES;
      emptyPile.addCard(card);
      expect(emptyPile.peek().equals(card)).toBe(true);
      expect(emptyPile.size).toBe(1);
    });
  });

  describe('addPile', () => {
    it('adds another pile to the top of the pile', () => {
      const newPile = new Pile([
        FACE_DOWN.KING_OF_SPADES,
        FACE_DOWN.QUEEN_OF_HEARTS,
      ]);
      pile.addPile(newPile);
      expect(pile.size).toBe(4);
      expect(pile.peek().equals(newPile.peek())).toBe(true);
    });

    it('adds an empty pile to the pile', () => {
      const newPile = new Pile([]);
      pile.addPile(newPile);
      expect(pile.size).toBe(2);
    });
  });

  describe('splitAt', () => {
    it('splits the pile at the specified card index', () => {
      const card = FACE_DOWN.ACE_OF_SPADES;
      pile.addCard(card);
      const splitCards = pile.splitAt(1);
      expect(splitCards.cards).toEqual([cardPile[1], card]);
      expect(splitCards.size).toBe(2);
      expect(pile.size).toBe(1);
      expect(pile.peek().equals(cardPile[0])).toBe(true);
    });

    it('throws when splitting at an invalid index', () => {
      expect(() => pile.splitAt(-1)).toThrow('Card index -1 not found.');
      expect(() => pile.splitAt(2)).toThrow('Card index 2 not found.');
    });

    it('should throw an error when splitting an empty pile', () => {
      expect(() => emptyPile.splitAt(0)).toThrow(
        'Cannot splitAt: pile is empty.',
      );
    });
  });

  describe('copy', () => {
    it('returns a copy of the pile', () => {
      const copiedPile = pile.copy();
      expect(copiedPile).not.toBe(pile);
      expect(copiedPile.cards).toEqual(pile.cards);
      expect(copiedPile.size).toBe(pile.size);
    });
  });

  describe('serialize', () => {
    it('serializes and deserializes the pile', () => {
      const serialized = pile.serialize();
      const deserialized = Pile.deserialize(serialized);
      expect(deserialized).toEqual(pile);
    });
  });
});
