import { Rank, Suit } from '../../models/card';
import {
  isDifferentColor,
  isNextHigherRank,
  isNextLowerRank,
  isSameSuit,
  isTopCard,
} from '../rules/rule_utils';
import { cardOf, pileOf } from './utils/spec_utils';

describe('Rule Utils', () => {
  const tenOfSpades = cardOf(Rank.Ten, Suit.Spades);
  const nineOfDiamonds = cardOf(Rank.Nine, Suit.Diamonds);
  const eightOfClubs = cardOf(Rank.Eight, Suit.Clubs);
  const sevenOfHearts = cardOf(Rank.Seven, Suit.Hearts);
  const sixOfDiamonds = cardOf(Rank.Six, Suit.Diamonds);
  const fiveOfSpades = cardOf(Rank.Five, Suit.Spades);

  describe('isDifferentColor', () => {
    it('returns true if the cards are different colors', () => {
      expect(isDifferentColor(tenOfSpades, nineOfDiamonds)).toBe(true);
      expect(isDifferentColor(eightOfClubs, sevenOfHearts)).toBe(true);
    });

    it('returns false if the cards are the same color', () => {
      expect(isDifferentColor(tenOfSpades, eightOfClubs)).toBe(false);
      expect(isDifferentColor(nineOfDiamonds, sevenOfHearts)).toBe(false);
    });
  });

  describe('isNextLowerRank', () => {
    it('returns true if the target card is the next lower rank', () => {
      expect(isNextLowerRank(tenOfSpades, nineOfDiamonds)).toBe(true);
      expect(isNextLowerRank(nineOfDiamonds, eightOfClubs)).toBe(true);
    });

    it('returns false if the target card is not the next lower rank', () => {
      expect(isNextLowerRank(tenOfSpades, eightOfClubs)).toBe(false);
      expect(isNextLowerRank(sevenOfHearts, nineOfDiamonds)).toBe(false);
    });
  });

  describe('isNextHigherRank', () => {
    it('returns true if the target card is the next higher rank', () => {
      expect(isNextHigherRank(nineOfDiamonds, tenOfSpades)).toBe(true);
      expect(isNextHigherRank(eightOfClubs, nineOfDiamonds)).toBe(true);
    });

    it('returns false if the target card is not the next higher rank', () => {
      expect(isNextHigherRank(tenOfSpades, eightOfClubs)).toBe(false);
      expect(isNextHigherRank(sevenOfHearts, nineOfDiamonds)).toBe(false);
    });
  });

  describe('isSameSuit', () => {
    it('returns true if the cards are of the same suit', () => {
      expect(isSameSuit(tenOfSpades, fiveOfSpades)).toBe(true);
      expect(isSameSuit(nineOfDiamonds, sixOfDiamonds)).toBe(true);
    });

    it('returns false if the cards are of different suits', () => {
      expect(isSameSuit(tenOfSpades, eightOfClubs)).toBe(false);
      expect(isSameSuit(nineOfDiamonds, sevenOfHearts)).toBe(false);
    });
  });

  describe('isTopCard', () => {
    it('returns true if the target card is the top card of the pile', () => {
      const pile = pileOf(tenOfSpades, nineOfDiamonds);
      expect(isTopCard(pile, tenOfSpades)).toBe(false);
    });

    it('returns false if the target card is not the top card of the pile', () => {
      const pile = pileOf(tenOfSpades, nineOfDiamonds);
      expect(isTopCard(pile, nineOfDiamonds)).toBe(true);
    });
  });
});
