import { MoveRequest } from '../../../../dto';
import { createTableauToTableauRequest } from '../../../../utils/create_move_request';
import { mockGame } from '../../../../utils/mocks';
import { STOCK, TABLEAU, WASTE } from '../../../../utils/pile.constants';
import { PileType } from '../../../pile';
import { createGameRules } from '../../factory/game_rules.factory';
import { GameType } from '../../game_type.enum';

describe('KlondikeRules', () => {
  const rules = createGameRules(GameType.Klondike);

  describe('isValidMove', () => {
    it('should throw an error when trying to move a card to stock', () => {
      const game = mockGame({ stock: [STOCK.EMPTY], waste: [WASTE.Q] });
      const invalidMove: MoveRequest = {
        cardIndex: 0,
        destination: { type: PileType.Stock, index: 0 },
        origin: { type: PileType.Waste, index: 0 },
      };
      expect(() => rules.isValidMove(game, invalidMove)).toThrow(
        'Game rule violated: Cannot move card to stock.',
      );
    });

    it('should throw an error when trying to move a card to waste', () => {
      const game = mockGame({
        waste: [WASTE.EMPTY],
        tableau: [TABLEAU.ALL_UP.Q],
      });
      const invalidMove: MoveRequest = {
        cardIndex: 0,
        destination: { type: PileType.Waste, index: 0 },
        origin: { type: PileType.Tableau, index: 0 },
      };
      expect(() => rules.isValidMove(game, invalidMove)).toThrow(
        'Game rule violated: Cannot move card to waste.',
      );
    });

    it('should throw an error when trying to move a card to its origin pile', () => {
      const game = mockGame({ tableau: [TABLEAU.ALL_UP.Q] });
      const invalidMove = createTableauToTableauRequest(0, 0, 0);
      expect(() => rules.isValidMove(game, invalidMove)).toThrow(
        'Game rule violated: Cannot move card to its origin pile: tableau 0',
      );
    });
  });
});
