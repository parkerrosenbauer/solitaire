import { FOUNDATION, STOCK, TABLEAU, WASTE } from '../../utils/pile.constants';
import { Card, Color, Rank, Suit } from '../card';
import { PileType } from '../pile';
import { Pile } from '../pile/pile';
import { Game } from './game';

describe('Game', () => {
  let game: Game;
  let startingPiles: Record<PileType, Pile[]>;

  beforeEach(() => {
    startingPiles = {
      foundation: [
        FOUNDATION.EMPTY,
        FOUNDATION.EMPTY,
        FOUNDATION.EMPTY,
        FOUNDATION.EMPTY,
      ],
      stock: [STOCK.EMPTY],
      tableau: [TABLEAU.ALL_UP.KQ],
      waste: [WASTE.EMPTY],
    };
    game = new Game(startingPiles);
  });

  describe('getPiles', () => {
    it('returns piles based on type', () => {
      const tableau = game.getPiles(PileType.Tableau);
      const stock = game.getPiles(PileType.Stock);
      expect(tableau.length).toBe(1);
      expect(stock.length).toBe(1);
    });

    it('returns copies of the piles, not references', () => {
      const tableau = game.getPiles(PileType.Tableau);
      expect(tableau[0]).not.toBe(startingPiles.tableau[0]);
      expect(tableau[0]).toEqual(startingPiles.tableau[0]);
      const stock = game.getPile(PileType.Stock, 0);
      expect(stock).not.toBe(startingPiles.stock[0]);
      expect(stock).toEqual(startingPiles.stock[0]);
    });
  });

  describe('getPile', () => {
    it('returns pile at index', () => {
      const firstTableau = game.getPile(PileType.Tableau, 0);
      expect(firstTableau).toEqual(TABLEAU.ALL_UP.KQ);
    });

    it('returns copy of pile, not reference', () => {
      const firstTableau = game.getPile(PileType.Tableau, 0);
      expect(firstTableau).not.toBe(startingPiles.tableau[0]);
      expect(firstTableau).toEqual(startingPiles.tableau[0]);
    });

    it('throws if index is invalid', () => {
      expect(() => game.getPile(PileType.Tableau, 1)).toThrow(
        'Game error: No pile exists at index 1.',
      );
    });
  });

  describe('getMutablePiles', () => {
    it('returns mutable piles based on type', () => {
      const tableau = game.getMutablePiles(PileType.Tableau);
      const stock = game.getMutablePiles(PileType.Stock);
      expect(tableau.length).toBe(1);
      expect(stock.length).toBe(1);
    });

    it('returns referecnes to the piles, not copies', () => {
      const tableau = game.getMutablePiles(PileType.Tableau);
      expect(tableau[0]).toBe(startingPiles.tableau[0]);
      const stock = game.getMutablePile(PileType.Stock, 0);
      expect(stock).toBe(startingPiles.stock[0]);
    });
  });

  describe('getMutablePile', () => {
    it('returns mutable pile at index', () => {
      const firstTableau = game.getMutablePile(PileType.Tableau, 0);
      expect(firstTableau).toBe(TABLEAU.ALL_UP.KQ);
    });

    it('returns reference to pile, not copy', () => {
      const firstTableau = game.getMutablePile(PileType.Tableau, 0);
      expect(firstTableau).toBe(startingPiles.tableau[0]);
    });

    it('throws if index is invalid', () => {
      expect(() => game.getMutablePile(PileType.Tableau, 1)).toThrow(
        'Game error: No pile exists at index 1.',
      );
    });
  });

  describe('arePilesEmpty', () => {
    it('returns true when all piles are empty', () => {
      expect(game.arePilesEmpty(PileType.Foundation)).toEqual(true);
    });

    it('returns false when not all piles are empty', () => {
      expect(game.arePilesEmpty(PileType.Tableau)).toEqual(false);
    });
  });

  describe('serialize', () => {
    it('serializes and deserializes game', () => {
      const serializedGame = game.serialize();
      const deserializedGame = Game.deserialize(serializedGame);
      expect(deserializedGame).toEqual(game);
    });
  });
});
