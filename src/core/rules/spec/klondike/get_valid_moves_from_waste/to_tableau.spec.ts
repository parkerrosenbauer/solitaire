import { createWasteToTableauRequest } from '../../../../../utils';
import { FACE_UP } from '../../../../../utils/card.constants';
import { mockGame, pileOf } from '../../../../../utils/mocks';
import { WASTE, TABLEAU } from '../../../../../utils/pile.constants';
import { createGameRules } from '../../../factory/game_rules.factory';
import { GameType } from '../../../game_type.enum';

describe('KlondikeRules', () => {
  const rules = createGameRules(GameType.Klondike);
  const wasteToTableau = createWasteToTableauRequest(0, 0, 0);
  describe('getValidMovesFromWaste', () => {
    describe('Waste → Tableau', () => {
      it('detects no move from empty waste', () => {
        const game = mockGame({
          waste: [WASTE.EMPTY],
          tableau: [TABLEAU.ALL_UP.S543],
        });
        const availableMoves = rules.getAllValidMoves(game);
        expect(availableMoves.length).toBe(0);
      });

      it('detects no move to empty pile without king', () => {
        const game = mockGame({ waste: [WASTE.S2], tableau: [TABLEAU.EMPTY] });
        const availableMoves = rules.getAllValidMoves(game);
        expect(availableMoves.length).toBe(0);
      });

      it('detects king to empty tableau', () => {
        const game = mockGame({ waste: [WASTE.K], tableau: [TABLEAU.EMPTY] });
        const availableMoves = rules.getAllValidMoves(game);
        expect(availableMoves.length).toBe(1);
        expect(availableMoves[0]).toEqual(wasteToTableau);
      });

      it('detects no move between populated pile and king', () => {
        const game = mockGame({
          waste: [WASTE.K],
          tableau: [TABLEAU.ALL_UP.S543],
        });
        const availableMoves = rules.getAllValidMoves(game);
        expect(availableMoves.length).toBe(0);
      });

      it('detects card to opposite color with next rank up', () => {
        const game = mockGame({
          waste: [pileOf(FACE_UP.TWO_OF_HEARTS)],
          tableau: [TABLEAU.ALL_UP.S543],
        });
        const availableMoves = rules.getAllValidMoves(game);
        expect(availableMoves.length).toBe(1);
        expect(availableMoves[0]).toEqual(wasteToTableau);
      });

      it('detects no move to not next rank up', () => {
        const game = mockGame({
          waste: [pileOf(FACE_UP.THREE_OF_HEARTS)],
          tableau: [TABLEAU.ALL_UP.S76543],
        });
        const availableMoves = rules.getAllValidMoves(game);
        expect(availableMoves.length).toBe(0);
      });

      it('detects no move with same color', () => {
        const game = mockGame({
          waste: [pileOf(FACE_UP.TWO_OF_SPADES)],
          tableau: [TABLEAU.ALL_UP.S543],
        });
        const availableMoves = rules.getAllValidMoves(game);
        expect(availableMoves.length).toBe(0);
      });
    });
  });
});
