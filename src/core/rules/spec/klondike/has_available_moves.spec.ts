import { mockGame } from '../../../../utils/mocks';
import { TABLEAU, FOUNDATION, WASTE } from '../../../../utils/pile.constants';
import { createGameRules } from '../../factory/game_rules.factory';
import { GameType } from '../../game_type.enum';

describe('KlondikeRules', () => {
  const rules = createGameRules(GameType.Klondike);
  describe('hasAvailableMoves', () => {
    it('should return true when there is one possible move', () => {
      const game = mockGame({
        tableau: [TABLEAU.ALL_UP.Q, TABLEAU.ALL_UP.K],
        foundation: [FOUNDATION.EMPTY],
      });
      expect(rules.hasAvailableMoves(game)).toBe(true);
    });

    it('should return true when there are multiple possible moves', () => {
      const game = mockGame({
        waste: [WASTE.A],
        tableau: [TABLEAU.ALL_UP.Q, TABLEAU.ALL_UP.K],
        foundation: [FOUNDATION.EMPTY],
      });
      expect(rules.hasAvailableMoves(game)).toBe(true);
    });

    it('should return false when there are no available moves', () => {
      const game1 = mockGame({
        tableau: [TABLEAU.EMPTY, TABLEAU.EMPTY],
        foundation: [FOUNDATION.EMPTY],
      });
      const game2 = mockGame({
        tableau: [TABLEAU.ALL_UP.S543, TABLEAU.ALL_UP.K],
        foundation: [FOUNDATION.A234],
      });
      expect(rules.hasAvailableMoves(game1)).toBe(false);
      expect(rules.hasAvailableMoves(game2)).toBe(false);
    });
  });
});
