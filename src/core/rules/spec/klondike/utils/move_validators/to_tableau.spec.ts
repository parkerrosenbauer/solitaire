import {
  createTableauToTableauRequest,
  createWasteToTableauRequest,
  createFoundationToTableauRequest,
} from '../../../../../../utils';
import { FACE_UP } from '../../../../../../utils/card.constants';
import { pileOf, mockGame } from '../../../../../../utils/mocks';
import { TABLEAU, WASTE } from '../../../../../../utils/pile.constants';
import { createGameRules } from '../../../../factory/game_rules.factory';
import { GameType } from '../../../../game_type.enum';

describe('KlondikeRules', () => {
  const rules = createGameRules(GameType.Klondike);

  const tableauToTableau = createTableauToTableauRequest(0, 1, 0);
  const wasteToTableau = createWasteToTableauRequest(0, 0, 0);
  const foundationToTableau = createFoundationToTableauRequest(0, 0, 0);

  describe('canMoveToTableau', () => {
    it('allows king to move to empty tableau', () => {
      const game = mockGame({ waste: [WASTE.K], tableau: [TABLEAU.EMPTY] });
      expect(rules.isValidMove(game, wasteToTableau)).toBe(true);
    });

    it('allows card to move to tableau where top card is one rank lower and opposite color', () => {
      const game = mockGame({ tableau: [TABLEAU.ALL_UP.Q, TABLEAU.ALL_UP.K] });
      expect(rules.isValidMove(game, tableauToTableau)).toBe(true);
    });

    it('allows stacked cards to move from tableau to tableau', () => {
      const game = mockGame({ tableau: [TABLEAU.ALL_UP.QJ, TABLEAU.ALL_UP.K] });
      expect(rules.isValidMove(game, tableauToTableau)).toBe(true);
    });

    it('does not allow non-king to move to empty tableau', () => {
      const game = mockGame({ waste: [WASTE.Q], tableau: [TABLEAU.EMPTY] });
      expect(rules.isValidMove(game, wasteToTableau)).toBe(false);
    });

    it('does not allow card to move to tableau where top card is not one rank higher', () => {
      const game = mockGame({
        waste: [pileOf(FACE_UP.JACK_OF_SPADES)],
        tableau: [TABLEAU.ALL_UP.K],
      });
      expect(rules.isValidMove(game, wasteToTableau)).toBe(false);
    });

    it('does not allow card to move to tableau where top card is same color', () => {
      const game = mockGame({
        waste: [pileOf(FACE_UP.QUEEN_OF_SPADES)],
        tableau: [pileOf(FACE_UP.KING_OF_CLUBS)],
      });
      expect(rules.isValidMove(game, wasteToTableau)).toBe(false);
    });

    it('does not allow multiple cards to move from waste to tableau', () => {
      const game = mockGame({
        waste: [pileOf(FACE_UP.QUEEN_OF_SPADES, FACE_UP.JACK_OF_DIAMONDS)],
        tableau: [pileOf(FACE_UP.KING_OF_HEARTS)],
      });
      expect(rules.isValidMove(game, wasteToTableau)).toBe(false);
    });

    it('does not allow multple cards to move from foundation to tableau', () => {
      const game = mockGame({
        tableau: [pileOf(FACE_UP.KING_OF_HEARTS)],
        foundation: [pileOf(FACE_UP.QUEEN_OF_SPADES, FACE_UP.JACK_OF_DIAMONDS)],
      });
      expect(rules.isValidMove(game, foundationToTableau)).toBe(false);
    });

    it('does not allow face down card to move', () => {
      const game = mockGame({
        tableau: [TABLEAU.ALL_UP.K, TABLEAU.FIRST_DOWN.QJ],
        foundation: [pileOf(FACE_UP.QUEEN_OF_SPADES, FACE_UP.JACK_OF_DIAMONDS)],
      });
      expect(rules.isValidMove(game, tableauToTableau)).toBe(false);
    });

    it('throws when trying to move a card from an empty pile', () => {
      const game = mockGame({ tableau: [TABLEAU.EMPTY, TABLEAU.ALL_UP.K] });
      expect(() => rules.isValidMove(game, tableauToTableau)).toThrow(
        'Game rule violated: Cannot move card from empty pile: tableau 0',
      );
    });

    it('throws when trying to move a card using an invalid index', () => {
      const game = mockGame({ tableau: [TABLEAU.ALL_UP.K, TABLEAU.ALL_UP.Q] });
      const invalidMove = createTableauToTableauRequest(1, 1, 0);
      expect(() => rules.isValidMove(game, invalidMove)).toThrow(
        'Game rule violated: Invalid card index: 1',
      );
    });
  });
});
