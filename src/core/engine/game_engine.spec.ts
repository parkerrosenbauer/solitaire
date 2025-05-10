import { Rank, Suit } from '../card';
import { cardOf, pileOf, mockGame } from '../../utilities/mocks';
import { GameEngine } from '../engine/game_engine';
import { GameRules } from '../rules/game_rules';
import { MoveDto } from '../../dto';
import { PileType } from '../pile';
import { createGameRules, GameType } from '../rules';

describe('GameEngine', () => {
  let mockRules: GameRules;

  beforeEach(() => {
    mockRules = {
      gameType: GameType.Klondike,
      isValidMove: jest.fn().mockReturnValue(true),
      canDrawFromStock: jest.fn().mockReturnValue(true),
      onDrawFromStock: jest.fn().mockReturnValue({
        destination: 'waste',
        flipDrawnCards: true,
        numberOfCards: 1,
        resetStockFromDestination: true,
      }),
      isWinConditionMet: jest.fn().mockReturnValue(true),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('moveCard', () => {
    it('moves a card from one pile to another', () => {
      const stock = pileOf(cardOf(Rank.A, Suit.Spades));
      const tableau = pileOf(cardOf(Rank.K, Suit.Diamonds));
      const game = mockGame([stock], [], [tableau]);

      const engine = new GameEngine(game, mockRules);
      const card = cardOf(Rank.A, Suit.Spades);
      const move: MoveDto = {
        serializedCard: card.serialize(),
        destination: { type: PileType.Tableau, index: 0 },
        origin: { type: PileType.Stock, index: 0 },
      };
      engine.moveCard(move);

      expect(stock.isEmpty).toBe(true);
      expect(tableau.peek().equals(cardOf(Rank.A, Suit.Spades))).toBe(true);
    });

    it('moves multiple cards from one pile to another', () => {
      const tableau1 = pileOf(cardOf(Rank.Q, Suit.Clubs));
      const tableau2 = pileOf(
        cardOf(Rank.A, Suit.Spades),
        cardOf(Rank.K, Suit.Diamonds),
      );
      const game = mockGame([], [], [tableau1, tableau2]);

      const engine = new GameEngine(game, mockRules);
      const card = cardOf(Rank.A, Suit.Spades);
      const move: MoveDto = {
        serializedCard: card.serialize(),
        destination: { type: PileType.Tableau, index: 0 },
        origin: { type: PileType.Tableau, index: 1 },
      };
      engine.moveCard(move);

      expect(tableau1.size).toBe(3);
      expect(tableau2.isEmpty).toBe(true);
      expect(tableau1.peek().equals(cardOf(Rank.K, Suit.Diamonds))).toBe(true);
    });

    it('throws an error if the move is invalid', () => {
      const mockIsValidMove = jest.spyOn(mockRules, 'isValidMove');
      mockIsValidMove.mockReturnValue(false);
      const engine = new GameEngine(mockGame(), mockRules);
      const card = cardOf(Rank.A, Suit.Spades);
      const move: MoveDto = {
        serializedCard: card.serialize(),
        destination: { type: PileType.Tableau, index: 0 },
        origin: { type: PileType.Foundation, index: 0 },
      };
      expect(() => engine.moveCard(move)).toThrow(
        'Invalid move according to the rules.',
      );
    });
  });

  describe('drawFromStock', () => {
    it('moves deals top card from stock', () => {
      const stock = pileOf(cardOf(Rank.Ten, Suit.Clubs));
      const waste = pileOf();

      const game = mockGame([stock], [waste]);

      const engine = new GameEngine(game, mockRules);
      engine.drawFromStock();

      expect(stock.isEmpty).toBe(true);
      expect(waste.peek().equals(cardOf(Rank.Ten, Suit.Clubs))).toBe(true);
    });

    it('deals to multiple destination piles', () => {
      const mockOnDrawFromStock = jest.spyOn(mockRules, 'onDrawFromStock');
      mockOnDrawFromStock.mockReturnValue({
        destination: PileType.Tableau,
        flipDrawnCards: true,
        numberOfCards: 1,
        resetStockFromDestination: false,
      });
      const stock = pileOf(
        cardOf(Rank.Ten, Suit.Clubs),
        cardOf(Rank.J, Suit.Spades),
      );
      const tableau1 = pileOf();
      const tableau2 = pileOf();

      const game = mockGame([stock], [], [tableau1, tableau2]);

      const engine = new GameEngine(game, mockRules);
      engine.drawFromStock();

      expect(stock.isEmpty).toBe(true);
      expect(tableau1.peek().equals(cardOf(Rank.J, Suit.Spades))).toBe(true);
      expect(tableau2.peek().equals(cardOf(Rank.Ten, Suit.Clubs))).toBe(true);
    });

    it('throws an error if stock runs out of cards when dealing to multiple piles', () => {
      const mockOnDrawFromStock = jest.spyOn(mockRules, 'onDrawFromStock');
      mockOnDrawFromStock.mockReturnValue({
        destination: PileType.Tableau,
        flipDrawnCards: true,
        numberOfCards: 1,
        resetStockFromDestination: false,
      });
      const stock = pileOf(cardOf(Rank.Ten, Suit.Clubs));
      const tableau1 = pileOf();
      const tableau2 = pileOf();

      const game = mockGame([stock], [], [tableau1, tableau2]);

      const engine = new GameEngine(game, mockRules);
      expect(() => engine.drawFromStock()).toThrow(
        'Game play error: Cannot draw from an empty stock.',
      );
    });

    it('deals cards in the correct order when dealing multiple cards', () => {
      const mockOnDrawFromStock = jest.spyOn(mockRules, 'onDrawFromStock');
      mockOnDrawFromStock.mockReturnValue({
        destination: PileType.Waste,
        flipDrawnCards: true,
        numberOfCards: 3,
        resetStockFromDestination: false,
      });
      const stock = pileOf(
        cardOf(Rank.Ten, Suit.Clubs),
        cardOf(Rank.J, Suit.Spades),
        cardOf(Rank.Q, Suit.Diamonds),
      );
      const waste = pileOf();

      const game = mockGame([stock], [waste]);

      const engine = new GameEngine(game, mockRules);
      engine.drawFromStock();

      expect(stock.size).toBe(0);
      expect(waste.size).toBe(3);
      expect(waste.cards[0].equals(cardOf(Rank.Q, Suit.Diamonds))).toBe(true);
      expect(waste.cards[1].equals(cardOf(Rank.J, Suit.Spades))).toBe(true);
      expect(waste.cards[2].equals(cardOf(Rank.Ten, Suit.Clubs))).toBe(true);
    });

    it('deals cards in the correct order when dealing multiple cards to multiple piles', () => {
      const mockOnDrawFromStock = jest.spyOn(mockRules, 'onDrawFromStock');
      mockOnDrawFromStock.mockReturnValue({
        destination: PileType.Tableau,
        flipDrawnCards: true,
        numberOfCards: 2,
        resetStockFromDestination: false,
      });
      const stock = pileOf(
        cardOf(Rank.Ten, Suit.Clubs),
        cardOf(Rank.J, Suit.Spades),
        cardOf(Rank.Q, Suit.Clubs),
        cardOf(Rank.K, Suit.Hearts),
      );
      const tableau1 = pileOf();
      const tableau2 = pileOf();

      const game = mockGame([stock], [], [tableau1, tableau2]);

      const engine = new GameEngine(game, mockRules);
      engine.drawFromStock();

      expect(stock.size).toBe(0);
      expect(tableau1.size).toBe(2);
      expect(tableau2.size).toBe(2);
      expect(tableau1.cards[0].equals(cardOf(Rank.K, Suit.Hearts))).toBe(true);
      expect(tableau1.cards[1].equals(cardOf(Rank.J, Suit.Spades))).toBe(true);
      expect(tableau2.cards[0].equals(cardOf(Rank.Q, Suit.Clubs))).toBe(true);
      expect(tableau2.cards[1].equals(cardOf(Rank.Ten, Suit.Clubs))).toBe(true);
    });

    it('deals card face up when specified', () => {
      const stock = pileOf(cardOf(Rank.Ten, Suit.Clubs));
      const waste = pileOf();

      const game = mockGame([stock], [waste]);

      const engine = new GameEngine(game, mockRules);
      engine.drawFromStock();

      expect(waste.peek().isFaceUp).toBe(true);
    });

    it('deals card face down when specified', () => {
      const mockOnDrawFromStock = jest.spyOn(mockRules, 'onDrawFromStock');
      mockOnDrawFromStock.mockReturnValue({
        destination: PileType.Waste,
        flipDrawnCards: false,
        numberOfCards: 1,
        resetStockFromDestination: true,
      });

      const stock = pileOf(cardOf(Rank.Ten, Suit.Clubs));
      const waste = pileOf();

      const game = mockGame([stock], [waste]);

      const engine = new GameEngine(game, mockRules);
      engine.drawFromStock();
      engine.drawFromStock();

      expect(waste.peek().isFaceUp).toBe(false);
    });

    it('resets stock if it is empty and waste has cards', () => {
      const stock = pileOf(
        cardOf(Rank.J, Suit.Spades),
        cardOf(Rank.Ten, Suit.Clubs),
      );
      const waste = pileOf();

      const game = mockGame([stock], [waste]);

      const engine = new GameEngine(game, mockRules);
      engine.drawFromStock();
      engine.drawFromStock();
      engine.drawFromStock();

      expect(stock.size).toBe(1);
      expect(stock.peek().equals(cardOf(Rank.J, Suit.Spades))).toBe(true);
      expect(stock.peek().isFaceUp).toBe(false);
      expect(waste.size).toBe(1);
      expect(waste.peek().equals(cardOf(Rank.Ten, Suit.Clubs))).toBe(true);
    });

    it('throws an error if multiple destination piles are used', () => {
      const stock = pileOf(cardOf(Rank.Ten, Suit.Clubs));
      const waste1 = pileOf();
      const waste2 = pileOf();

      const game = mockGame([stock], [waste1, waste2]);

      const engine = new GameEngine(game, mockRules);

      expect(() => engine.drawFromStock()).toThrow(
        'Cannot reset stock using multiple destination piles.',
      );
    });

    it('correctly orders the cards when resetting stock', () => {
      const stock = pileOf(
        cardOf(Rank.J, Suit.Spades),
        cardOf(Rank.Ten, Suit.Clubs),
        cardOf(Rank.Nine, Suit.Diamonds),
      );
      const waste = pileOf();

      const game = mockGame([stock], [waste]);

      const engine = new GameEngine(game, mockRules);
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

      const engine = new GameEngine(game, mockRules);

      expect(() => engine.drawFromStock()).toThrow(
        'Game play error: Cannot reset stock from an empty waste pile.',
      );
    });
  });

  describe('isWinConditionMet', () => {
    it('returns true if the win condition is met', () => {
      const engine = new GameEngine(mockGame(), mockRules);
      expect(engine.isWinConditionMet()).toBe(true);
    });

    it('returns false if the win condition is not met', () => {
      const mockIsWinConditionMet = jest.spyOn(mockRules, 'isWinConditionMet');
      mockIsWinConditionMet.mockReturnValue(false);
      const engine = new GameEngine(mockGame(), mockRules);
      expect(engine.isWinConditionMet()).toBe(false);
    });
  });

  describe('serialize', () => {
    it('serializes and deserializes the game engine correctly', () => {
      const game = mockGame([], [], [], []);
      const engine = new GameEngine(game, createGameRules(GameType.Klondike));
      const serialized = engine.serialize();

      const deserializedEngine = GameEngine.deserialize(serialized);
      expect(deserializedEngine).toEqual(engine);
    });
  });
});
