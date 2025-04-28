import { Card } from '../../models';
import { Color, Rank, Suit } from '../../models/card';
import { Pile } from '../../models/pile';
import { Game } from '../game';
import { PileType } from '../game_initializer';

describe('Game', () => {
  let game: Game;
  let startingPiles: Record<PileType, Pile[]>;
  const cardPile = [
    new Card(Suit.Clubs, Rank.A, Color.Black),
    new Card(Suit.Diamonds, Rank.Ten, Color.Red),
  ];
  const emptyPile = new Pile([]);
  const pile = new Pile(cardPile);

  beforeEach(() => {
    startingPiles = {
      foundation: [emptyPile],
      stock: [emptyPile],
      tableau: [pile],
      waste: [emptyPile],
    };
    game = new Game(startingPiles);
  });

  it('should return the piles based on type', () => {
    const tableau = game.getPiles('tableau');
    const stock = game.getPiles('stock');

    expect(tableau.length).toBe(1);
    expect(stock.length).toBe(1);
  });

  it('should return copies of the piles, not references', () => {
    const tableau = game.getPiles('tableau');
    expect(tableau[0]).not.toBe(startingPiles.tableau[0]);
    expect(tableau[0]).toEqual(startingPiles.tableau[0]);

    const stock = game.getPile('stock', 0);
    expect(stock).not.toBe(startingPiles.stock[0]);
    expect(stock).toEqual(startingPiles.stock[0]);
  });

  it('should return the pile at the specified index', () => {
    const firstTableau = game.getPile('tableau', 0);
    expect(firstTableau).toEqual(pile);
  });

  it('should error if index is invalid', () => {
    expect(() => game.getPile('tableau', 1)).toThrow(
      'Game error: No pile exists at index 1.',
    );
  });
});
