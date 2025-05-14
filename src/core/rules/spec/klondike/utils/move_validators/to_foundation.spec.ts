import {
  createWasteToFoundationRequest,
  createTableauToFoundationRequest,
} from '../../../../../../utils';
import { FACE_DOWN, FACE_UP } from '../../../../../../utils/card.constants';
import { pileOf, mockGame } from '../../../../../../utils/mocks';
import {
  FOUNDATION,
  TABLEAU,
  WASTE,
} from '../../../../../../utils/pile.constants';
import { createGameRules } from '../../../../factory/game_rules.factory';
import { GameType } from '../../../../game_type.enum';

describe('KlondikeRules', () => {
  const rules = createGameRules(GameType.Klondike);

  const wasteToFoundation = createWasteToFoundationRequest(0, 0, 0);
  const tableauToFoundation = createTableauToFoundationRequest(0, 0, 0);

  describe('canMoveToFoundation', () => {
    it('allows ace to move to empty foundation', () => {
      const game = mockGame({
        waste: [WASTE.A],
        foundation: [FOUNDATION.EMPTY],
      });
      expect(rules.isValidMove(game, wasteToFoundation)).toBe(true);
    });

    it('allows card to move to foundation with same suit and next rank down', () => {
      const game = mockGame({
        waste: [WASTE.S2],
        foundation: [FOUNDATION.A],
      });
      expect(rules.isValidMove(game, wasteToFoundation)).toBe(true);
    });

    it('does not allow a non-ace to move to empty foundation', () => {
      const game = mockGame({
        waste: [WASTE.K],
        foundation: [FOUNDATION.EMPTY],
      });
      expect(rules.isValidMove(game, wasteToFoundation)).toBe(false);
    });

    it('does not allow card to move to foundation without one rank down', () => {
      const game = mockGame({ waste: [WASTE.K], foundation: [FOUNDATION.A] });
      expect(rules.isValidMove(game, wasteToFoundation)).toBe(false);
    });

    it('does not allow card to move to foundation with different suit', () => {
      const game = mockGame({
        waste: [pileOf(FACE_UP.TWO_OF_HEARTS)],
        foundation: [FOUNDATION.A],
      });
      expect(rules.isValidMove(game, wasteToFoundation)).toBe(false);
    });

    it('does not allow card to move to foundation if not top card', () => {
      const game = mockGame({ waste: [WASTE.S2K], foundation: [FOUNDATION.A] });
      expect(rules.isValidMove(game, wasteToFoundation)).toBe(false);
    });

    it('does not allow face down card to move', () => {
      const game = mockGame({
        tableau: [pileOf(FACE_DOWN.TWO_OF_SPADES)],
        foundation: [FOUNDATION.A],
      });
      expect(rules.isValidMove(game, tableauToFoundation)).toBe(false);
    });

    it('throws when trying to move card from empty pile', () => {
      const game = mockGame({
        tableau: [TABLEAU.EMPTY],
        foundation: [FOUNDATION.A],
      });
      expect(() => rules.isValidMove(game, tableauToFoundation)).toThrow(
        'Game rule violated: Cannot move card from empty pile: tableau 0',
      );
    });

    it('throws when trying to move card using invalid index', () => {
      const game = mockGame({
        tableau: [pileOf(FACE_UP.TWO_OF_SPADES)],
        foundation: [FOUNDATION.A],
      });
      const invalidMove = createTableauToFoundationRequest(1, 0, 0);
      expect(() => rules.isValidMove(game, invalidMove)).toThrow(
        'Game rule violated: Invalid card index: 1',
      );
    });
  });
});
