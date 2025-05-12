import { FACE_DOWN } from '../../utils/card.constants';
import { Deck } from './deck';

describe('Deck', () => {
  const cards = [
    FACE_DOWN.KING_OF_SPADES,
    FACE_DOWN.KING_OF_CLUBS,
    FACE_DOWN.KING_OF_HEARTS,
    FACE_DOWN.QUEEN_OF_SPADES,
  ];

  let deck: Deck;
  let emptyDeck: Deck;

  beforeEach(() => {
    deck = new Deck([...cards]);
    emptyDeck = new Deck([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a deck with provided cards', () => {
    expect(deck.size).toBe(4);
  });

  describe('peek', () => {
    it('returns last card of deck', () => {
      expect(deck.peek).toEqual(cards[3]);
    });

    it('retturns undefined when deck is empty', () => {
      expect(emptyDeck.peek).toEqual(undefined);
    });
  });

  describe('shuffle', () => {
    it('shuffles the deck', () => {
      const mockRandom = jest.spyOn(Math, 'random');
      mockRandom.mockImplementation(() => 0.5);
      deck.shuffle();
      expect(deck.cards).not.toEqual(cards);
    });

    it('shuffles the deck with empty deck', () => {
      const mockRandom = jest.spyOn(Math, 'random');
      mockRandom.mockImplementation(() => 0.5);
      emptyDeck.shuffle();
      expect(emptyDeck.cards).toEqual([]);
    });
  });

  describe('draw', () => {
    it('draws last card from the deck', () => {
      const drawnCard = deck.draw();
      expect(drawnCard.equals(cards[cards.length - 1])).toEqual(true);
      expect(deck.size).toBe(3);
    });

    it('throws when drawing from an empty deck', () => {
      expect(() => emptyDeck.draw()).toThrow('Cannot draw: deck is empty.');
    });
  });

  describe('addCard', () => {
    it('adds card to the top of the deck', () => {
      deck.addCard(FACE_DOWN.ACE_OF_SPADES);
      expect(deck.peek).toBe(FACE_DOWN.ACE_OF_SPADES);
      expect(deck.size).toBe(5);
    });
  });

  describe('reset', () => {
    it('resets deck with original cards', () => {
      deck.draw();
      expect(deck.size).toBe(3);
      deck.reset();
      expect(deck.size).toBe(4);
      expect(deck.cards).toEqual(cards);
    });

    it('resets the deck with new cards', () => {
      const newCardDeck = [
        FACE_DOWN.ACE_OF_SPADES,
        FACE_DOWN.ACE_OF_HEARTS,
        FACE_DOWN.ACE_OF_CLUBS,
      ];
      deck.reset(newCardDeck);
      expect(deck.cards).toEqual(newCardDeck);
    });
  });

  describe('removeAllCards', () => {
    it('removes all cards from the deck maintaining order', () => {
      const originalDeck = [...cards];
      const transferedCards = deck.removeAllCards();
      expect(deck.isEmpty).toBe(true);
      expect(transferedCards).toEqual(originalDeck);
    });

    it('throws if removing all cards from empty deck', () => {
      expect(() => emptyDeck.removeAllCards()).toThrow(
        'Cannot draw: deck is empty.',
      );
    });
  });

  describe('copy', () => {
    it('returns a copy of the deck', () => {
      const copiedDeck = deck.copy();
      expect(copiedDeck).not.toBe(deck);
      expect(copiedDeck.cards).toEqual(deck.cards);
    });

    it('returns a copy of the empty deck', () => {
      const copiedDeck = emptyDeck.copy();
      expect(copiedDeck).not.toBe(emptyDeck);
      expect(copiedDeck.cards).toEqual(emptyDeck.cards);
    });
  });
});
