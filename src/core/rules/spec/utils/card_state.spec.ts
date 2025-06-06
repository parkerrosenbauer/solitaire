import { FACE_DOWN } from '../../../../utils/card.constants';
import { pileOf } from '../../../../utils/mocks';
import * as RuleUtils from '../../utils';

describe('Card State Functions', () => {
  describe('isTopCard', () => {
    it('returns true if the target card is the top card of the pile', () => {
      const pile = pileOf(FACE_DOWN.TEN_OF_SPADES, FACE_DOWN.NINE_OF_DIAMONDS);
      expect(RuleUtils.isTopCard(pile, 1)).toBe(true);
    });

    it('returns false if the target card is not the top card of the pile', () => {
      const pile = pileOf(FACE_DOWN.TEN_OF_SPADES, FACE_DOWN.NINE_OF_DIAMONDS);
      expect(RuleUtils.isTopCard(pile, 0)).toBe(false);
    });
  });

  describe('isAce', () => {
    it('returns true if the card is an Ace', () => {
      expect(RuleUtils.isAce(FACE_DOWN.ACE_OF_CLUBS)).toBe(true);
    });

    it('returns false if the card is not an Ace', () => {
      expect(RuleUtils.isAce(FACE_DOWN.TWO_OF_CLUBS)).toBe(false);
    });
  });

  describe('isKing', () => {
    it('returns true if the card is a King', () => {
      expect(RuleUtils.isKing(FACE_DOWN.KING_OF_CLUBS)).toBe(true);
    });

    it('returns false if the card is not a King', () => {
      expect(RuleUtils.isKing(FACE_DOWN.QUEEN_OF_DIAMONDS)).toBe(false);
    });
  });
});
