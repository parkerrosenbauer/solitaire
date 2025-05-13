import {
  createWasteToTableauRequest,
  createTableauToTableauRequest,
} from '../../utils';
import { FACE_DOWN, FACE_UP } from '../../utils/card.constants';
import { cardOf, mockGame } from '../../utils/mocks';
import { STOCK, TABLEAU, WASTE } from '../../utils/pile.constants';
import { Rank, Suit } from '../card';
import { PileType } from '../pile';
import { DrawFromStockConfig } from '../rules';
import { GameEngine } from './game_engine';

describe('GameEngine', () => {
  const wasteToTableau = createWasteToTableauRequest(0, 0, 0);
  const tableauToTableau = createTableauToTableauRequest(0, 0, 1);
  let drawFromStockToTableau: DrawFromStockConfig;
  let drawFromStockToWaste: DrawFromStockConfig;

  beforeEach(() => {
    drawFromStockToWaste = {
      destination: PileType.Waste,
      flipDrawnCards: true,
      numberOfCards: 1,
      resetStockFromDestination: true,
    };
    drawFromStockToTableau = {
      destination: PileType.Tableau,
      flipDrawnCards: true,
      numberOfCards: 1,
      resetStockFromDestination: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('moveCard', () => {
    it('moves card from one pile to another', () => {
      const waste = WASTE.A.copy();
      const tableau = TABLEAU.ALL_UP.K.copy();
      const game = mockGame({ waste: [waste], tableau: [tableau] });
      const engine = new GameEngine(game);
      engine.moveCard(wasteToTableau);
      expect(waste.isEmpty).toBe(true);
      expect(tableau.peek().equals(cardOf(Rank.A, Suit.Spades))).toBe(true);
    });

    it('moves multiple cards from one pile to another', () => {
      const tableauOrigin = TABLEAU.ALL_UP.QJ.copy();
      const tableauDestination = TABLEAU.ALL_UP.K.copy();
      const game = mockGame({ tableau: [tableauDestination, tableauOrigin] });
      const engine = new GameEngine(game);
      engine.moveCard(tableauToTableau);
      expect(tableauDestination.size).toBe(3);
      expect(tableauOrigin.isEmpty).toBe(true);
      expect(tableauDestination.peek().equals(FACE_UP.JACK_OF_SPADES)).toBe(
        true,
      );
    });
  });

  describe('drawFromStock', () => {
    it('deals top card from stock', () => {
      const stock = STOCK.A.copy();
      const waste = WASTE.EMPTY.copy();
      const game = mockGame({ stock: [stock], waste: [waste] });
      const engine = new GameEngine(game);
      engine.drawFromStock(drawFromStockToWaste);
      expect(stock.isEmpty).toBe(true);
      expect(waste.peek().equals(FACE_UP.ACE_OF_SPADES)).toBe(true);
    });

    it('deals to multiple piles', () => {
      const stock = STOCK.S10J.copy();
      const tableau1 = TABLEAU.EMPTY.copy();
      const tableau2 = TABLEAU.ALL_UP.K.copy();
      const game = mockGame({ stock: [stock], tableau: [tableau1, tableau2] });
      const engine = new GameEngine(game);
      engine.drawFromStock(drawFromStockToTableau);
      expect(stock.isEmpty).toBe(true);
      expect(tableau1.peek().equals(FACE_DOWN.JACK_OF_SPADES)).toBe(true);
      expect(tableau2.peek().equals(FACE_DOWN.TEN_OF_SPADES)).toBe(true);
    });

    it('throws if stock runs out of cards when dealing to multiple piles', () => {
      const stock = STOCK.A.copy();
      const tableau1 = TABLEAU.EMPTY.copy();
      const tableau2 = TABLEAU.ALL_UP.K.copy();
      const game = mockGame({
        stock: [stock],
        tableau: [tableau1, tableau2],
      });
      const engine = new GameEngine(game);
      expect(() => engine.drawFromStock(drawFromStockToTableau)).toThrow(
        'Game play error: Cannot draw from an empty stock.',
      );
    });

    it('deals multiple cards in correct order', () => {
      drawFromStockToWaste.numberOfCards = 3;
      const stock = STOCK.S10JQ.copy();
      const waste = WASTE.EMPTY.copy();
      const game = mockGame({ stock: [stock], waste: [waste] });
      const engine = new GameEngine(game);
      engine.drawFromStock(drawFromStockToWaste);
      expect(stock.size).toBe(0);
      expect(waste.size).toBe(3);
      expect(waste.cards[0].equals(FACE_DOWN.QUEEN_OF_SPADES)).toBe(true);
      expect(waste.cards[1].equals(FACE_DOWN.JACK_OF_SPADES)).toBe(true);
      expect(waste.cards[2].equals(FACE_DOWN.TEN_OF_SPADES)).toBe(true);
    });

    it('deals multiple cards in correct order when dealing to multiple piles', () => {
      drawFromStockToTableau.numberOfCards = 2;
      const stock = STOCK.S10JQK.copy();
      const tableau1 = TABLEAU.EMPTY.copy();
      const tableau2 = TABLEAU.ALL_UP.K.copy();
      const game = mockGame({ stock: [stock], tableau: [tableau1, tableau2] });
      const engine = new GameEngine(game);
      engine.drawFromStock(drawFromStockToTableau);
      expect(stock.size).toBe(0);
      expect(tableau1.size).toBe(2);
      expect(tableau2.size).toBe(3);
      expect(tableau1.cards[0].equals(FACE_DOWN.KING_OF_SPADES)).toBe(true);
      expect(tableau1.cards[1].equals(FACE_DOWN.JACK_OF_SPADES)).toBe(true);
      expect(tableau2.cards[1].equals(FACE_DOWN.QUEEN_OF_SPADES)).toBe(true);
      expect(tableau2.cards[2].equals(FACE_DOWN.TEN_OF_SPADES)).toBe(true);
    });

    it('deals card face up when specified', () => {
      const stock = STOCK.A.copy();
      const waste = WASTE.EMPTY.copy();
      const game = mockGame({ stock: [stock], waste: [waste] });
      const engine = new GameEngine(game);
      engine.drawFromStock(drawFromStockToWaste);
      expect(waste.peek().isFaceUp).toBe(true);
    });

    it('deals card face down when specified', () => {
      drawFromStockToWaste.flipDrawnCards = false;
      const stock = STOCK.A.copy();
      const waste = WASTE.EMPTY.copy();
      const game = mockGame({ stock: [stock], waste: [waste] });
      const engine = new GameEngine(game);
      engine.drawFromStock(drawFromStockToWaste);
      expect(waste.peek().isFaceUp).toBe(false);
    });

    it('resets stock if empty and waste is not', () => {
      const stock = STOCK.S10J.copy();
      const waste = WASTE.EMPTY.copy();
      const game = mockGame({ stock: [stock], waste: [waste] });
      const engine = new GameEngine(game);
      engine.drawFromStock(drawFromStockToWaste);
      engine.drawFromStock(drawFromStockToWaste);
      engine.drawFromStock(drawFromStockToWaste);
      expect(stock.size).toBe(1);
      expect(stock.peek().equals(FACE_DOWN.TEN_OF_SPADES)).toBe(true);
      expect(stock.peek().isFaceUp).toBe(false);
      expect(waste.size).toBe(1);
      expect(waste.peek().equals(FACE_DOWN.JACK_OF_SPADES)).toBe(true);
    });

    it('throws if multiple reset destination piles', () => {
      const stock = STOCK.A.copy();
      const waste1 = WASTE.EMPTY.copy();
      const waste2 = WASTE.EMPTY.copy();
      const game = mockGame({ stock: [stock], waste: [waste1, waste2] });
      const engine = new GameEngine(game);
      expect(() => engine.drawFromStock(drawFromStockToWaste)).toThrow(
        'Cannot reset stock using multiple destination piles.',
      );
    });

    it('correctly orders cards when resetting stock', () => {
      const stock = STOCK.S10JQ.copy();
      const waste = WASTE.EMPTY.copy();
      const game = mockGame({ stock: [stock], waste: [waste] });
      const engine = new GameEngine(game);
      engine.drawFromStock(drawFromStockToWaste);
      engine.drawFromStock(drawFromStockToWaste);
      engine.drawFromStock(drawFromStockToWaste);
      engine.drawFromStock(drawFromStockToWaste);
      expect(stock.cards.map((c) => c.rank)).toEqual([Rank.Ten, Rank.J]);
    });

    it('throws if stock and waste are empty', () => {
      const stock = STOCK.EMPTY.copy();
      const waste = WASTE.EMPTY.copy();
      const game = mockGame({ stock: [stock], waste: [waste] });
      const engine = new GameEngine(game);
      expect(() => engine.drawFromStock(drawFromStockToWaste)).toThrow(
        'Game play error: Cannot reset stock from an empty waste pile.',
      );
    });
  });
});
