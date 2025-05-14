import e from 'express';
import { createDrawFromStockRequest } from '../../../../../../utils';
import { mockGame, pileOf } from '../../../../../../utils/mocks';
import {
  FOUNDATION,
  STOCK,
  TABLEAU,
  WASTE,
} from '../../../../../../utils/pile.constants';
import { PileType } from '../../../../../pile';
import { createGameRules } from '../../../../factory/game_rules.factory';
import { GameType } from '../../../../game_type.enum';
import { FACE_DOWN, FACE_UP } from '../../../../../../utils/card.constants';

describe('KlondikeRules', () => {
  const rules = createGameRules(GameType.Klondike);
  const drawFromStock = createDrawFromStockRequest(PileType.Waste);
  describe('getValidMovesFromStock', () => {
    it('does not detect moves when stock and waste are empty', () => {
      const game = mockGame({});
      const availableMoves = rules.getAllValidMoves(game);
      expect(availableMoves.length).toBe(0);
    });
    it('does not detect draw from stock when move is available from tableau', () => {
      const game = mockGame({
        stock: [pileOf(FACE_DOWN.QUEEN_OF_DIAMONDS)],
        tableau: [TABLEAU.FIRST_DOWN.Q, TABLEAU.ALL_UP.K],
      });
      const availableMoves = rules.getAllValidMoves(game);
      expect(availableMoves.length).toBe(1);
      expect(availableMoves[0]).not.toEqual(drawFromStock);
    });
    it('does not detect draw from stock when move is available from foundation', () => {
      const game = mockGame({
        stock: [STOCK.A],
        tableau: [
          pileOf(FACE_UP.THREE_OF_HEARTS),
          pileOf(FACE_UP.FIVE_OF_DIAMONDS),
        ],
        foundation: [FOUNDATION.A234, FOUNDATION.EMPTY],
      });
      const availableMoves = rules.getAllValidMoves(game);
      expect(availableMoves.length).toBe(2);
      expect(availableMoves[0]).not.toEqual(drawFromStock);
      expect(availableMoves[1]).not.toEqual(drawFromStock);
    });

    it('does not detect draw from stock when move is available from top waste', () => {
      const game = mockGame({
        waste: [WASTE.K],
        tableau: [TABLEAU.EMPTY],
        stock: [STOCK.K],
      });
      const availableMoves = rules.getAllValidMoves(game);
      console.log('availableMoves', availableMoves);
      expect(availableMoves.length).toBe(1);
      expect(availableMoves[0]).not.toEqual(drawFromStock);
    });

    it('detects draw from stock when move is available from stock', () => {
      const game = mockGame({
        foundation: [FOUNDATION.EMPTY],
        stock: [STOCK.A],
        waste: [WASTE.Q],
      });
      const availableMoves = rules.getAllValidMoves(game);
      expect(availableMoves.length).toBe(1);
      expect(availableMoves[0]).toEqual(drawFromStock);
    });

    it('detects draw from stock when move is available from waste (not top card)', () => {
      const game = mockGame({
        foundation: [FOUNDATION.A],
        stock: [STOCK.S10J],
        waste: [WASTE.S2K],
        tableau: [TABLEAU.ALL_UP.S543],
      });
      const availableMoves = rules.getAllValidMoves(game);
      expect(availableMoves.length).toBe(1);
      expect(availableMoves[0]).toEqual(drawFromStock);
    });

    it('does not detect draw from stock when no moves are available within stock or waste', () => {
      const game = mockGame({
        foundation: [FOUNDATION.A234],
        stock: [STOCK.S10J],
        waste: [WASTE.S2K],
        tableau: [TABLEAU.ALL_UP.S543],
      });
      const availableMoves = rules.getAllValidMoves(game);
      expect(availableMoves.length).toBe(0);
    });
  });
});
