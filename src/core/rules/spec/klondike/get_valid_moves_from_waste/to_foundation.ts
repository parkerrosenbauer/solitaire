import { createWasteToFoundationRequest } from '../../../../../utils';
import { FACE_UP } from '../../../../../utils/card.constants';
import { mockGame, pileOf } from '../../../../../utils/mocks';
import { WASTE, FOUNDATION } from '../../../../../utils/pile.constants';
import { createGameRules } from '../../../factory/game_rules.factory';
import { GameType } from '../../../game_type.enum';

describe('KlondikeRules', () => {
  const rules = createGameRules(GameType.Klondike);
  const wasteToFoundation = createWasteToFoundationRequest(0, 0, 0);
  describe('getValidMovesFromWaste', () => {
    describe('Waste → Foundation', () => {
      it('detects no move from empty waste', () => {
        const game = mockGame({
          waste: [WASTE.EMPTY],
          foundation: [FOUNDATION.A],
        });
        const availableMoves = rules.getAllValidMoves(game);
        expect(availableMoves.length).toBe(0);
      });

      it('detects no move to empty pile without ace', () => {
        const game = mockGame({
          waste: [WASTE.S2],
          foundation: [FOUNDATION.EMPTY],
        });
        const availableMoves = rules.getAllValidMoves(game);
        expect(availableMoves.length).toBe(0);
      });

      it('detects ace to empty foundation', () => {
        const game = mockGame({
          waste: [WASTE.A],
          foundation: [FOUNDATION.EMPTY],
        });
        const availableMoves = rules.getAllValidMoves(game);
        console.log('availableMoves', availableMoves);
        expect(availableMoves.length).toBe(1);
        expect(availableMoves[0]).toEqual(wasteToFoundation);
      });

      it('detects no move between populated pile and ace', () => {
        const game = mockGame({
          waste: [WASTE.A],
          tableau: [FOUNDATION.A234],
        });
        const availableMoves = rules.getAllValidMoves(game);
        expect(availableMoves.length).toBe(0);
      });

      it('detects card to same color with next rank down', () => {
        const game = mockGame({
          waste: [WASTE.S2],
          foundation: [FOUNDATION.A],
        });
        const availableMoves = rules.getAllValidMoves(game);
        expect(availableMoves.length).toBe(1);
        expect(availableMoves[0]).toEqual(wasteToFoundation);
      });

      it('detects no move to not next rank down', () => {
        const game = mockGame({
          waste: [pileOf(FACE_UP.SIX_OF_SPADES)],
          foundation: [FOUNDATION.A234],
        });
        const availableMoves = rules.getAllValidMoves(game);
        expect(availableMoves.length).toBe(0);
      });

      it('detects no move with opposite color', () => {
        const game = mockGame({
          waste: [pileOf(FACE_UP.TWO_OF_HEARTS)],
          foundation: [FOUNDATION.A],
        });
        const availableMoves = rules.getAllValidMoves(game);
        expect(availableMoves.length).toBe(0);
      });
    });
  });
});
