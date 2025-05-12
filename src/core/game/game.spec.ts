import { FOUNDATION, STOCK, TABLEAU, WASTE } from '../../utils/pile.constants';
import { Card, Color, Rank, Suit } from '../card';
import { PileType } from '../pile';
import { Pile } from '../pile/pile';
import { Game } from './game';

describe('Game', () => {
  let game: Game;
  let startingPiles: Record<PileType, Pile[]>;
  const card1 = new Card(Suit.Clubs, Rank.A, Color.Black);
  const card2 = new Card(Suit.Diamonds, Rank.Ten, Color.Red);
  const emptyPile = new Pile([]);
  const pile = new Pile([card1, card2]);

  beforeEach(() => {
    startingPiles = {
      foundation: [emptyPile, emptyPile, emptyPile, emptyPile],
      stock: [emptyPile],
      tableau: [pile],
      waste: [emptyPile],
    };
    game = new Game(startingPiles);
  });

  it('should return the piles based on type', () => {
    const tableau = game.getPiles(PileType.Tableau);
    const stock = game.getPiles(PileType.Stock);

    expect(tableau.length).toBe(1);
    expect(stock.length).toBe(1);
  });

  it('should return copies of the piles, not references', () => {
    const tableau = game.getPiles(PileType.Tableau);
    expect(tableau[0]).not.toBe(startingPiles.tableau[0]);
    expect(tableau[0]).toEqual(startingPiles.tableau[0]);

    const stock = game.getPile(PileType.Stock, 0);
    expect(stock).not.toBe(startingPiles.stock[0]);
    expect(stock).toEqual(startingPiles.stock[0]);
  });

  it('should return the pile at the specified index', () => {
    const firstTableau = game.getPile(PileType.Tableau, 0);
    expect(firstTableau).toEqual(pile);
  });

  it('should error if index is invalid', () => {
    expect(() => game.getPile(PileType.Tableau, 1)).toThrow(
      'Game error: No pile exists at index 1.',
    );
  });

  it('should retun true when all piles of specific type are empty', () => {
    expect(game.arePilesEmpty(PileType.Foundation)).toEqual(true);
  });

  it('should return false when not all piles of specified type are empty', () => {
    expect(game.arePilesEmpty(PileType.Tableau)).toEqual(false);
  });

  it('should serialize and deserialize the game', () => {
    const serializedGame = game.serialize();
    const deserializedGame = Game.deserialize(serializedGame);
    expect(deserializedGame).toEqual(game);
  });
});
