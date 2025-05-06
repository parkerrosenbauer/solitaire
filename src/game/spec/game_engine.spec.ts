import { Rank, Suit } from '../../models/card';
import { cardOf, pileOf, mockGame } from './utils/spec_utils';
import { GameEngine } from '../game_engine';
import { createGameRules, GameType } from '../rules/create_game_rules';

describe('GameEngine', () => {
  const solitaireRules = createGameRules(GameType.Solitaire);

  describe('drawFromStock', () => {
    it('moves the top card from stock to waste', () => {
      const stock = pileOf(cardOf(Rank.Ten, Suit.Clubs));
      const waste = pileOf();

      const game = mockGame([stock], [waste]);

      const engine = new GameEngine(game, solitaireRules);
      engine.drawFromStock();

      expect(stock.isEmpty).toBe(true);
      expect(waste.peek().equals(cardOf(Rank.Ten, Suit.Clubs))).toBe(true);
    });

    it('sets the card in waste to face up', () => {
      const stock = pileOf(cardOf(Rank.Ten, Suit.Clubs));
      const waste = pileOf();

      const game = mockGame([stock], [waste]);

      const engine = new GameEngine(game, solitaireRules);
      engine.drawFromStock();

      expect(waste.peek().isFaceUp).toBe(true);
    });

    it('resets stock if it is empty and waste has cards', () => {
      const stock = pileOf(
        cardOf(Rank.J, Suit.Spades),
        cardOf(Rank.Ten, Suit.Clubs),
      );
      const waste = pileOf();

      const game = mockGame([stock], [waste]);

      const engine = new GameEngine(game, solitaireRules);
      engine.drawFromStock();
      engine.drawFromStock();
      engine.drawFromStock();

      expect(stock.size).toBe(1);
      expect(stock.peek().equals(cardOf(Rank.J, Suit.Spades))).toBe(true);
      expect(stock.peek().isFaceUp).toBe(false);
      expect(waste.size).toBe(1);
      expect(waste.peek().equals(cardOf(Rank.Ten, Suit.Clubs))).toBe(true);
    });

    it('correctly orders the cards when resetting stock', () => {
      const stock = pileOf(
        cardOf(Rank.J, Suit.Spades),
        cardOf(Rank.Ten, Suit.Clubs),
        cardOf(Rank.Nine, Suit.Diamonds),
      );
      const waste = pileOf();

      const game = mockGame([stock], [waste]);

      const engine = new GameEngine(game, solitaireRules);
      engine.drawFromStock();
      engine.drawFromStock();
      engine.drawFromStock();
      engine.drawFromStock();

      expect(stock.cards.map((c) => c.rank)).toEqual([Rank.J, Rank.Ten]);
    });

    it('throws an error if stock and waste are empty', () => {
      const stock = pileOf();
      const waste = pileOf();

      const game = mockGame([stock], [waste]);

      const engine = new GameEngine(game, solitaireRules);

      expect(() => engine.drawFromStock()).toThrow(
        'Game play error: Cannot reset stock from an empty waste pile.',
      );
    });
  });
});
