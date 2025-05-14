/**
 * getAllValidMoves test coverage:
 *
 * From Tableau:
 *  - King card to empty tableau (king only)
 *  - Lone/multi-card to valid tableau stack
 *  - Card to foundation (empty pile or proper suit/rank)
 *  - nth face-up card to tableau IF prior card can move to foundation
 *  - Deny invalid moves (wrong suit/rank/color)
 *
 * From Waste:
 *  - To foundation (ace to empty, next rank, same suit)
 *  - To tableau (king to empty, next rank, different suit)
 *  - Deny invalid moves (wrong suit/rank/color)
 *
 * From Foundation:
 *  - To tableau IF it enables a new move
 *  - Deny invalid moves (wrong suit/rank/color)
 *
 * From Stock:
 *  - Allowed only when no other valid moves
 *  - Deny draw if moves available elsewhere
 *
 */

import {
  createTableauToTableauRequest,
  createTableauToFoundationRequest,
} from '../../../../../utils';
import { FACE_UP } from '../../../../../utils/card.constants';
import { mockGame, pileOf } from '../../../../../utils/mocks';
import { TABLEAU } from '../../../../../utils/pile.constants';
import { createGameRules } from '../../../factory/game_rules.factory';
import { GameType } from '../../../game_type.enum';

describe('KlondikeRules', () => {
  const rules = createGameRules(GameType.Klondike);

  describe('getAllValidMoves', () => {
    it('detects multiple moves within a single tableau pile', () => {
      const game = mockGame({
        tableau: [
          TABLEAU.ALL_UP.S76543,
          pileOf(FACE_UP.FIVE_OF_CLUBS),
          pileOf(FACE_UP.SIX_OF_HEARTS),
        ],
        foundation: [
          pileOf(FACE_UP.FOUR_OF_SPADES),
          pileOf(FACE_UP.FIVE_OF_DIAMONDS),
        ],
      });
      const availableMoves = rules.getAllValidMoves(game);
      const expectedMoves = [
        createTableauToTableauRequest(2, 2, 0),
        createTableauToFoundationRequest(1, 1, 0),
        createTableauToTableauRequest(3, 1, 0),
        createTableauToFoundationRequest(2, 0, 0),
        createTableauToTableauRequest(0, 2, 1),
      ];
      expect(availableMoves.length).toBe(5);
      expect(availableMoves).toEqual(expectedMoves);
    });
  });
});
