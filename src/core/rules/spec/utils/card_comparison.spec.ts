import { FACE_DOWN } from '../../../../utils/card.constants';
import {
  isDifferentColor,
  isNextLowerRank,
  isNextHigherRank,
  isSameSuit,
} from '../../utils';

describe('Card Comparisson Functions', () => {
  describe('isDifferentColor', () => {
    it('returns true if the cards are different colors', () => {
      expect(
        isDifferentColor(FACE_DOWN.TEN_OF_SPADES, FACE_DOWN.NINE_OF_DIAMONDS),
      ).toBe(true);
      expect(
        isDifferentColor(FACE_DOWN.EIGHT_OF_CLUBS, FACE_DOWN.SEVEN_OF_HEARTS),
      ).toBe(true);
    });

    it('returns false if the cards are the same color', () => {
      expect(
        isDifferentColor(FACE_DOWN.TEN_OF_SPADES, FACE_DOWN.EIGHT_OF_CLUBS),
      ).toBe(false);
      expect(
        isDifferentColor(FACE_DOWN.NINE_OF_DIAMONDS, FACE_DOWN.SEVEN_OF_HEARTS),
      ).toBe(false);
    });
  });

  describe('isNextLowerRank', () => {
    it('returns true if the target card is the next lower rank', () => {
      expect(
        isNextLowerRank(FACE_DOWN.TEN_OF_SPADES, FACE_DOWN.NINE_OF_DIAMONDS),
      ).toBe(true);
      expect(
        isNextLowerRank(FACE_DOWN.NINE_OF_DIAMONDS, FACE_DOWN.EIGHT_OF_CLUBS),
      ).toBe(true);
    });

    it('returns false if the target card is not the next lower rank', () => {
      expect(
        isNextLowerRank(FACE_DOWN.TEN_OF_SPADES, FACE_DOWN.EIGHT_OF_CLUBS),
      ).toBe(false);
      expect(
        isNextLowerRank(FACE_DOWN.SEVEN_OF_HEARTS, FACE_DOWN.NINE_OF_DIAMONDS),
      ).toBe(false);
    });
  });

  describe('isNextHigherRank', () => {
    it('returns true if the target card is the next higher rank', () => {
      expect(
        isNextHigherRank(FACE_DOWN.NINE_OF_DIAMONDS, FACE_DOWN.TEN_OF_SPADES),
      ).toBe(true);
      expect(
        isNextHigherRank(FACE_DOWN.EIGHT_OF_CLUBS, FACE_DOWN.NINE_OF_DIAMONDS),
      ).toBe(true);
    });

    it('returns false if the target card is not the next higher rank', () => {
      expect(
        isNextHigherRank(FACE_DOWN.TEN_OF_SPADES, FACE_DOWN.EIGHT_OF_CLUBS),
      ).toBe(false);
      expect(
        isNextHigherRank(FACE_DOWN.SEVEN_OF_HEARTS, FACE_DOWN.NINE_OF_DIAMONDS),
      ).toBe(false);
    });
  });

  describe('isSameSuit', () => {
    it('returns true if the cards are of the same suit', () => {
      expect(
        isSameSuit(FACE_DOWN.TEN_OF_SPADES, FACE_DOWN.FIVE_OF_SPADES),
      ).toBe(true);
      expect(
        isSameSuit(FACE_DOWN.NINE_OF_DIAMONDS, FACE_DOWN.SIX_OF_DIAMONDS),
      ).toBe(true);
    });

    it('returns false if the cards are of different suits', () => {
      expect(
        isSameSuit(FACE_DOWN.TEN_OF_SPADES, FACE_DOWN.EIGHT_OF_CLUBS),
      ).toBe(false);
      expect(
        isSameSuit(FACE_DOWN.NINE_OF_DIAMONDS, FACE_DOWN.SEVEN_OF_HEARTS),
      ).toBe(false);
    });
  });
});
