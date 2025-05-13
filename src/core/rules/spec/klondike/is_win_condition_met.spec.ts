import { mockGame } from '../../../../utils/mocks';
import { FOUNDATION, TABLEAU } from '../../../../utils/pile.constants';
import { createGameRules } from '../../factory/game_rules.factory';
import { GameType } from '../../game_type.enum';

describe('KlondikeRules', () => {
  const rules = createGameRules(GameType.Klondike);

  describe('isWinConditionMet', () => {
    it('should return rue when all piles except foundation are empty', () => {
      const game = mockGame({ foundation: [FOUNDATION.FULL_SPADES] });
      expect(rules.isWinConditionMet(game)).toBe(true);
    });

    it('should return false when there are cards in other piles', () => {
      const game = mockGame({
        tableau: [TABLEAU.ALL_UP.K],
        foundation: [FOUNDATION.FULL_SPADES],
      });
      expect(rules.isWinConditionMet(game)).toBe(false);
    });

    it('should return false when a foundation pile is empty', () => {
      const game = mockGame({
        foundation: [FOUNDATION.EMPTY, FOUNDATION.FULL_SPADES],
      });
      expect(rules.isWinConditionMet(game)).toBe(false);
    });

    it('should return false when not all foundation piles are full', () => {
      const game = mockGame({
        foundation: [FOUNDATION.A, FOUNDATION.FULL_SPADES],
      });
      expect(rules.isWinConditionMet(game)).toBe(false);
    });
  });
});
