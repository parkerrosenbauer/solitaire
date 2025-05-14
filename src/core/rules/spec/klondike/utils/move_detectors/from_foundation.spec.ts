import {
  createFoundationToTableauRequest,
  createTableauToTableauRequest,
} from '../../../../../../utils';
import { FACE_UP } from '../../../../../../utils/card.constants';
import { mockGame, pileOf } from '../../../../../../utils/mocks';
import { FOUNDATION, TABLEAU } from '../../../../../../utils/pile.constants';
import { createGameRules } from '../../../../factory/game_rules.factory';
import { GameType } from '../../../../game_type.enum';

describe('KlondikeRules', () => {
  const rules = createGameRules(GameType.Klondike);
  describe('getValidMovesFromFoundation', () => {
    it('detects no move if no cards in foundation', () => {
      const game = mockGame({ foundation: [FOUNDATION.EMPTY] });
      const availableMoves = rules.getAllValidMoves(game);
      expect(availableMoves.length).toBe(0);
    });

    it('detects no move if no cards in tableau', () => {
      const game = mockGame({
        tableau: [TABLEAU.EMPTY],
        foundation: [FOUNDATION.A],
      });
      const availableMoves = rules.getAllValidMoves(game);
      expect(availableMoves.length).toBe(0);
    });

    it('detects no move if top card cannot move to tableau', () => {
      const game = mockGame({
        tableau: [pileOf(FACE_UP.FOUR_OF_HEARTS)],
        foundation: [FOUNDATION.A234],
      });
      const availableMoves = rules.getAllValidMoves(game);
      expect(availableMoves.length).toBe(0);
    });

    it('detects no move if top card to tableau, but first face up of other tableau cannot move to card', () => {
      const game = mockGame({
        tableau: [pileOf(FACE_UP.KING_OF_HEARTS)],
        foundation: [pileOf(FACE_UP.QUEEN_OF_SPADES)],
      });
      const availableMoves = rules.getAllValidMoves(game);
      expect(availableMoves.length).toBe(0);
    });

    it('detects no move of king to empty tableau', () => {
      const game = mockGame({
        tableau: [TABLEAU.EMPTY],
        foundation: [FOUNDATION.FULL_SPADES],
      });
      const availableMoves = rules.getAllValidMoves(game);
      expect(availableMoves.length).toBe(0);
    });

    it('detects no move if top card to tableau and non-first face up of other tableau can move to card', () => {
      const game = mockGame({
        tableau: [TABLEAU.ALL_UP.S76543, pileOf(FACE_UP.SIX_OF_DIAMONDS)],
        foundation: [pileOf(FACE_UP.FIVE_OF_CLUBS)],
      });
      const availableMoves = rules.getAllValidMoves(game);
      expect(availableMoves.length).toBe(0);
    });

    it('detects move if top card to tableau and first face up of other tableau can move to card', () => {
      const game = mockGame({
        tableau: [
          pileOf(FACE_UP.THREE_OF_HEARTS),
          pileOf(FACE_UP.FIVE_OF_DIAMONDS),
        ],
        foundation: [FOUNDATION.A234],
      });
      const availableMoves = rules.getAllValidMoves(game);
      const expectedMoves = [
        createFoundationToTableauRequest(3, 1, 0),
        createTableauToTableauRequest(0, 1, 0),
      ];
      expect(availableMoves.length).toBe(2);
      expect(availableMoves).toEqual(expectedMoves);
    });

    it('detects no move if top card is same color as tableau', () => {
      const game = mockGame({
        tableau: [
          pileOf(FACE_UP.THREE_OF_CLUBS),
          pileOf(FACE_UP.FIVE_OF_CLUBS),
        ],
        foundation: [FOUNDATION.A234],
      });
      const availableMoves = rules.getAllValidMoves(game);
      expect(availableMoves.length).toBe(0);
    });

    it('detects no move if top card is not one rank lower than tableau', () => {
      const game = mockGame({
        tableau: [
          pileOf(FACE_UP.THREE_OF_HEARTS),
          pileOf(FACE_UP.SIX_OF_DIAMONDS),
        ],
        foundation: [FOUNDATION.A234],
      });
      const availableMoves = rules.getAllValidMoves(game);
      expect(availableMoves.length).toBe(0);
    });
  });
});
