import {
  createTableauToTableauRequest,
  createTableauToFoundationRequest,
} from '../../../../../../../utils';
import { FACE_UP } from '../../../../../../../utils/card.constants';
import { mockGame, pileOf } from '../../../../../../../utils/mocks';
import { TABLEAU } from '../../../../../../../utils/pile.constants';
import { createGameRules } from '../../../../../factory/game_rules.factory';
import { GameType } from '../../../../../game_type.enum';

describe('KlondikeRules', () => {
  const rules = createGameRules(GameType.Klondike);
  const loneTableauToTableau = createTableauToTableauRequest(0, 1, 0);
  const firstFaceUpTableauToTableau = createTableauToTableauRequest(1, 1, 0);
  describe('getValidMovesFromTableau', () => {
    describe('Tableau → Tableau', () => {
      describe('Moving first face up card', () => {
        it('detects no move of lone king to empty tableau', () => {
          const game = mockGame({ tableau: [TABLEAU.ALL_UP.K, TABLEAU.EMPTY] });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(0);
        });

        it('detects king above face down to empty tableau', () => {
          const game = mockGame({
            tableau: [TABLEAU.FIRST_DOWN.K, TABLEAU.EMPTY],
          });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(1);
          expect(availableMoves[0]).toEqual(firstFaceUpTableauToTableau);
        });

        it('detects no move of lone king with stack to empty tableau', () => {
          const game = mockGame({
            tableau: [TABLEAU.ALL_UP.KQ, TABLEAU.EMPTY],
          });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(0);
        });

        it('detects move of king with stack to empty tableau', () => {
          const game = mockGame({
            tableau: [TABLEAU.FIRST_DOWN.KQ, TABLEAU.EMPTY],
          });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(1);
          expect(availableMoves[0]).toEqual(firstFaceUpTableauToTableau);
        });

        it('detects lone card to opposite color tableau with next rank up', () => {
          const game = mockGame({
            tableau: [TABLEAU.ALL_UP.Q, TABLEAU.ALL_UP.K],
          });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(1);
          expect(availableMoves[0]).toEqual(loneTableauToTableau);
        });

        it('detects card above face down to opposite color tableau with next rank up', () => {
          const game = mockGame({
            tableau: [TABLEAU.FIRST_DOWN.Q, TABLEAU.ALL_UP.K],
          });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(1);
          expect(availableMoves[0]).toEqual(firstFaceUpTableauToTableau);
        });

        it('detects card with stack to opposite color tableau with next rank up', () => {
          const game = mockGame({
            tableau: [TABLEAU.ALL_UP.QJ, TABLEAU.ALL_UP.K],
          });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(1);
          expect(availableMoves[0]).toEqual(loneTableauToTableau);
        });

        it('detects no move to empty pile without king', () => {
          const game = mockGame({
            tableau: [TABLEAU.ALL_UP.Q, TABLEAU.EMPTY],
          });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(0);
        });

        it('detects no move between populated pile and king', () => {
          const game = mockGame({
            tableau: [TABLEAU.ALL_UP.S543, TABLEAU.ALL_UP.K],
          });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(0);
        });
      });

      describe('Moving nth face up card', () => {
        it('detects move if previous can move to foundation (first face up)', () => {
          const game = mockGame({
            tableau: [TABLEAU.ALL_UP.S543, pileOf(FACE_UP.FIVE_OF_CLUBS)],
            foundation: [pileOf(FACE_UP.FOUR_OF_SPADES)],
          });
          const availableMoves = rules.getAllValidMoves(game);
          const expectedMoves = [
            createTableauToTableauRequest(1, 1, 0),
            createTableauToFoundationRequest(0, 0, 0),
          ];
          expect(availableMoves.length).toBe(2);
          expect(availableMoves).toEqual(expectedMoves);
        });

        it('detects move if previous can move to foundation (not first face up)', () => {
          const game = mockGame({
            tableau: [TABLEAU.FIRST_DOWN.S543, pileOf(FACE_UP.FIVE_OF_CLUBS)],
            foundation: [pileOf(FACE_UP.FOUR_OF_SPADES)],
          });
          const availableMoves = rules.getAllValidMoves(game);
          const expectedMoves = [
            createTableauToTableauRequest(2, 1, 0),
            createTableauToFoundationRequest(1, 0, 0),
          ];
          expect(availableMoves.length).toBe(2);
          expect(availableMoves).toEqual(expectedMoves);
        });

        it('does not detect move if previous card cannot move', () => {
          const game = mockGame({
            tableau: [TABLEAU.ALL_UP.S543, pileOf(FACE_UP.FIVE_OF_CLUBS)],
          });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(0);
        });

        it('does not detect move if previous card could move to tableau, not foundation (not first face up)', () => {
          const game = mockGame({
            tableau: [
              TABLEAU.FIRST_DOWN.H6543,
              pileOf(FACE_UP.FIVE_OF_CLUBS),
              pileOf(FACE_UP.SIX_OF_HEARTS),
            ],
          });
          const availableMoves = rules.getAllValidMoves(game);
          const expectedMove = createTableauToTableauRequest(0, 2, 1);

          expect(availableMoves.length).toBe(1);
          expect(availableMoves[0]).toEqual(expectedMove);
        });
      });
    });
  });
});
