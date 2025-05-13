import { mockGame, pileOf } from '../../../../../utils/mocks';
import { createGameRules } from '../../../factory/game_rules.factory';
import { GameType } from '../../../game_type.enum';
import { FOUNDATION, TABLEAU } from '../../../../../utils/pile.constants';
import { FACE_UP } from '../../../../../utils/card.constants';
import { createTableauToFoundationRequest } from '../../../../../utils';

describe('KlondikeRules', () => {
  const rules = createGameRules(GameType.Klondike);
  const loneTableauToFoundation = createTableauToFoundationRequest(0, 0, 0);
  const firstFaceUpTableauToFoundation = createTableauToFoundationRequest(
    1,
    0,
    0,
  );

  describe('getValidMovesFromTableau', () => {
    describe('Tableau → Foundaiton', () => {
      describe('Moving first face up card', () => {
        it('detects lone ace to empty foundation', () => {
          const game = mockGame({
            tableau: [TABLEAU.ALL_UP.A],
            foundation: [FOUNDATION.EMPTY],
          });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(1);
          expect(availableMoves[0]).toEqual(loneTableauToFoundation);
        });

        it('detects ace above face down to empty foundation', () => {
          const game = mockGame({
            tableau: [TABLEAU.FIRST_DOWN.A],
            foundation: [FOUNDATION.EMPTY],
          });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(1);
          expect(availableMoves[0]).toEqual(firstFaceUpTableauToFoundation);
        });

        it('detects lone card to foundation with same suit and next rank down', () => {
          const game = mockGame({
            tableau: [pileOf(FACE_UP.TWO_OF_SPADES)],
            foundation: [FOUNDATION.A],
          });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(1);
          expect(availableMoves[0]).toEqual(loneTableauToFoundation);
        });

        it('detects card above face down to foundation with same suit and next rank down', () => {
          const game = mockGame({
            tableau: [TABLEAU.FIRST_DOWN.S2],
            foundation: [FOUNDATION.A],
          });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(1);
          expect(availableMoves[0]).toEqual(firstFaceUpTableauToFoundation);
        });

        it('prioritizes detecting foundation move over tableau move when both possible', () => {
          const game = mockGame({
            tableau: [TABLEAU.FIRST_DOWN.S2, pileOf(FACE_UP.THREE_OF_HEARTS)],
            foundation: [FOUNDATION.A],
          });
          const availableMoves = rules.getAllValidMoves(game);
          expect(availableMoves.length).toBe(1);
          expect(availableMoves[0]).toEqual(firstFaceUpTableauToFoundation);
        });
      });
    });
  });
});
