import { Deck } from '../deck';
import { Card, Color, Rank, Suit } from '../card';

describe('Deck', () => {
  const cardDeck: Card[] = [];
  const suits = Object.values(Suit) as Array<Suit>;
  const ranks = Object.values(Rank).filter(
    (value) => typeof value === 'number',
  ) as Array<Rank>;

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      let color = Color.Red;
      if (suit === 'spades' || suit === 'clubs') {
        color = Color.Black;
      }
      cardDeck.push(new Card(suit, rank, color));
    });
  });

  let deck: Deck;
  let emptyDeck: Deck;

  beforeEach(() => {
    deck = new Deck([...cardDeck]);
    emptyDeck = new Deck([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a deck with the provided cards', () => {
    expect(deck.size).toBe(52);
  });

  it('should return the last card of the deck when peeking', () => {
    expect(deck.peek).toEqual(cardDeck[cardDeck.length - 1]);
  });

  it('should return undefined when peeking at an empty deck', () => {
    expect(emptyDeck.peek).toEqual(undefined);
  });

  it('should shuffle the deck', () => {
    const mockRandom = jest.spyOn(Math, 'random');
    mockRandom.mockImplementation(() => 0.5);
    deck.shuffle();
    expect(deck.cards).not.toEqual(cardDeck);
  });

  it('should draw last card from the deck', () => {
    const drawnCard = deck.draw();
    expect(drawnCard.equals(cardDeck[cardDeck.length - 1])).toEqual(true);
    expect(deck.size).toBe(51);
  });

  it('should throw an error when drawing from an empty deck', () => {
    expect(() => emptyDeck.draw()).toThrow('Cannot draw: deck is empty.');
  });

  it('should add a card to the top of the deck', () => {
    const card = deck.draw();
    deck.addCard(card);
    expect(deck.peek).toBe(card);
    expect(deck.size).toBe(52);
  });

  it('should reset the deck with original cards', () => {
    deck.draw();
    expect(deck.size).toBe(51);
    deck.reset();
    expect(deck.size).toBe(52);
  });

  it('should reset the deck with new cards', () => {
    const newCardDeck = [
      new Card(Suit.Clubs, Rank.A, Color.Black),
      new Card(Suit.Diamonds, Rank.Ten, Color.Red),
    ];
    deck.reset(newCardDeck);
    expect(deck.cards).toEqual(newCardDeck);
  });

  it('should remove all cards from the deck in the same order', () => {
    const originalDeck = [...cardDeck];
    const transferedCards = deck.removeAllCards();
    expect(deck.isEmpty).toBe(true);
    expect(transferedCards).toEqual(originalDeck);
  });

  it('should error if attempting to remove all cards from empty deck', () => {
    expect(() => emptyDeck.removeAllCards()).toThrow(
      'Cannot draw: deck is empty.',
    );
  });
});
