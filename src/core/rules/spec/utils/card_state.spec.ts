import { FACE_DOWN } from '../../../../utils/card.constants';
import { pileOf } from '../../../../utils/mocks';
import * as RuleUtils from '../../utils';

describe('Card State Functions', () => {
  describe('isTopCard', () => {
    it('returns true if the target card is the top card of the pile', () => {
      const pile = pileOf(FACE_DOWN.TEN_OF_SPADES, FACE_DOWN.NINE_OF_DIAMONDS);
      expect(RuleUtils.isTopCard(pile, 0)).toBe(false);
    });

    it('returns false if the target card is not the top card of the pile', () => {
      const pile = pileOf(FACE_DOWN.TEN_OF_SPADES, FACE_DOWN.NINE_OF_DIAMONDS);
      expect(RuleUtils.isTopCard(pile, 1)).toBe(true);
    });
  });
});
