import { FACE_DOWN, FACE_UP } from '../../../../utils/card.constants';
import { pileOf } from '../../../../utils/mocks';
import { findFirstFaceUpCardIndex } from '../../utils';

describe('Card Search Functions', () => {
  describe('findFirstFaceUpCardIndex', () => {
    it('returns the index of the first face-up card', () => {
      const pile = pileOf(
        FACE_DOWN.TEN_OF_SPADES,
        FACE_UP.SEVEN_OF_HEARTS,
        FACE_UP.SIX_OF_DIAMONDS,
      );
      expect(findFirstFaceUpCardIndex(pile)).toBe(1);
    });

    it('returns -1 if there are no face-up cards', () => {
      const pile = pileOf(
        FACE_DOWN.TEN_OF_SPADES,
        FACE_DOWN.SEVEN_OF_HEARTS,
        FACE_DOWN.SIX_OF_DIAMONDS,
      );
      expect(findFirstFaceUpCardIndex(pile)).toBe(-1);
    });

    it('returns -1 if the pile is empty', () => {
      const pile = pileOf();
      expect(findFirstFaceUpCardIndex(pile)).toBe(-1);
    });
  });
});
