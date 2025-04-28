import { Pile } from '../pile';
import { Card, Color, Rank, Suit } from '../card';

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

  it('should return the last card of the pile when peeking', () => {
    expect(pile.peek).toEqual(cardPile[cardPile.length - 1]);
  });

  it('should throw an error when peeking at an empty pile', () => {
    expect(() => emptyPile.peek).toThrow('Cannot draw: pile is empty.');
  });

  it('should draw last card from the deck', () => {
    const card = pile.draw();
    expect(card.equals(cardPile[cardPile.length - 1])).toEqual(true);
    expect(pile.size).toBe(1);
  });

  it('should throw an error when drawing from an empty pile', () => {
    expect(() => emptyPile.draw()).toThrow('Cannot draw: pile is empty.');
  });

  it('should add a card to the top of the pile', () => {
    const card = new Card(Suit.Hearts, Rank.Three, Color.Red);
    pile.addCard(card);
    expect(pile.peek).toBe(card);
    expect(pile.size).toBe(3);
  });

  it('should add a card to an empty pile', () => {
    const card = new Card(Suit.Hearts, Rank.Three, Color.Red);
    emptyPile.addCard(card);
    expect(emptyPile.peek).toBe(card);
    expect(emptyPile.size).toBe(1);
  });

  it('should initialize with all cards provided', () => {
    emptyPile.cards = [...cardPile];
    expect(emptyPile.size).toBe(2);
    expect(emptyPile.cards).toEqual(cardPile);
  });
});
