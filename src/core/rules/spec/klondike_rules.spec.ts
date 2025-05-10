import { MoveDto } from '../../../dto';
import { cardOf, pileOf, mockGame } from '../../../utilities/mocks';
import { Rank, Suit } from '../../card';
import { PileType } from '../../pile';
import { createGameRules } from '../create_game_rules';
import { GameRules } from '../game_rules';
import { GameType } from '../game_type.enum';

describe('GameRules', () => {
  let rules: GameRules;

  beforeEach(() => {
    rules = createGameRules(GameType.Klondike);
  });

  describe('canMoveToTableau', () => {
    describe('valid moves', () => {
      it('should allow a king to move to an empty tableau pile', () => {
        const card = cardOf(Rank.K, Suit.Spades, true);
        const waste = pileOf(card);
        const tableau = pileOf();
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: { type: PileType.Tableau, index: 0 },
          origin: { type: PileType.Waste, index: 0 },
        };
        const game = mockGame([], [waste], [tableau]);

        expect(rules.isValidMove(game, move)).toBe(true);
      });

      it('should allow a card to move to tableau pile where top card is one rank lower and opposite color', () => {
        const card = cardOf(Rank.Q, Suit.Spades, true);
        const waste = pileOf(card);
        const tableau = pileOf(cardOf(Rank.K, Suit.Hearts));
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: { type: PileType.Tableau, index: 0 },
          origin: { type: PileType.Waste, index: 0 },
        };
        const game = mockGame([], [waste], [tableau]);

        expect(rules.isValidMove(game, move)).toBe(true);
      });

      it('should allow a card to move to tableau pile where top card is one rank higher and opposite color', () => {
        const card = cardOf(Rank.Q, Suit.Spades, true);
        const waste = pileOf(card);
        const tableau = pileOf(cardOf(Rank.K, Suit.Hearts));
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: { type: PileType.Tableau, index: 0 },
          origin: { type: PileType.Waste, index: 0 },
        };
        const game = mockGame([], [waste], [tableau]);

        expect(rules.isValidMove(game, move)).toBe(true);
      });

      it('should allow multiple cards to move from tableau to tableau', () => {
        const card = cardOf(Rank.Q, Suit.Spades, true);
        const tableau1 = pileOf(card, cardOf(Rank.J, Suit.Diamonds));
        const tableau2 = pileOf(cardOf(Rank.K, Suit.Hearts, true));
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: { type: PileType.Tableau, index: 1 },
          origin: { type: PileType.Tableau, index: 0 },
        };
        const game = mockGame([], [], [tableau1, tableau2]);

        expect(rules.isValidMove(game, move)).toBe(true);
      });
    });

    describe('invalid moves', () => {
      it('should not allow a non-king to move to an empty tableau pile', () => {
        const card = cardOf(Rank.Q, Suit.Spades, true);
        const waste = pileOf(card);
        const tableau = pileOf();
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: { type: PileType.Tableau, index: 0 },
          origin: { type: PileType.Waste, index: 0 },
        };
        const game = mockGame([], [waste], [tableau]);

        expect(rules.isValidMove(game, move)).toBe(false);
      });

      it('should not allow a card to move to tableau pile where top card is not one rank higher', () => {
        const card = cardOf(Rank.J, Suit.Spades, true);
        const waste = pileOf(card);
        const tableau = pileOf(cardOf(Rank.K, Suit.Hearts));
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: { type: PileType.Tableau, index: 0 },
          origin: { type: PileType.Waste, index: 0 },
        };
        const game = mockGame([], [waste], [tableau]);

        expect(rules.isValidMove(game, move)).toBe(false);
      });

      it('should not allow a card to move to tableau pile where top card is the same color', () => {
        const card = cardOf(Rank.Q, Suit.Spades, true);
        const waste = pileOf(card);
        const tableau = pileOf(cardOf(Rank.K, Suit.Clubs));
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: { type: PileType.Tableau, index: 0 },
          origin: { type: PileType.Waste, index: 0 },
        };
        const game = mockGame([], [waste], [tableau]);

        expect(rules.isValidMove(game, move)).toBe(false);
      });

      it('should not allow multiple cards to move from waste to tableau', () => {
        const card = cardOf(Rank.Q, Suit.Spades, true);
        const waste = pileOf(card, cardOf(Rank.J, Suit.Diamonds));
        const tableau = pileOf(cardOf(Rank.K, Suit.Hearts));
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: { type: PileType.Tableau, index: 0 },
          origin: { type: PileType.Waste, index: 0 },
        };
        const game = mockGame([], [waste], [tableau]);

        expect(rules.isValidMove(game, move)).toBe(false);
      });

      it('should not allow multple cards to move from foundation to tableau', () => {
        const card = cardOf(Rank.Q, Suit.Spades, true);
        const foundation = pileOf(card, cardOf(Rank.J, Suit.Diamonds));
        const tableau = pileOf(cardOf(Rank.K, Suit.Hearts));
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: { type: PileType.Tableau, index: 0 },
          origin: { type: PileType.Foundation, index: 0 },
        };
        const game = mockGame([], [], [tableau], [foundation]);

        expect(rules.isValidMove(game, move)).toBe(false);
      });
    });
  });

  describe('canMoveToFoundation', () => {
    describe('valid moves', () => {
      it('should allow an ace to move to an empty foundation pile', () => {
        const card = cardOf(Rank.A, Suit.Spades, true);
        const waste = pileOf(card);
        const foundation = pileOf();
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: { type: PileType.Foundation, index: 0 },
          origin: { type: PileType.Waste, index: 0 },
        };
        const game = mockGame([], [waste], [], [foundation]);

        expect(rules.isValidMove(game, move)).toBe(true);
      });

      it('should allow a card to move to foundation pile where top card is one rank higher and same suit', () => {
        const card = cardOf(Rank.Two, Suit.Spades, true);
        const waste = pileOf(card);
        const foundation = pileOf(cardOf(Rank.A, Suit.Spades));
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: {
            type: PileType.Foundation,
            index: 0,
          },
          origin: { type: PileType.Waste, index: 0 },
        };
        const game = mockGame([], [waste], [], [foundation]);

        expect(rules.isValidMove(game, move)).toBe(true);
      });
    });

    describe('invalid moves', () => {
      it('should not allow a non-ace to move to an empty foundation pile', () => {
        const card = cardOf(Rank.Q, Suit.Spades, true);
        const waste = pileOf(card);
        const foundation = pileOf();
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: { type: PileType.Foundation, index: 0 },
          origin: { type: PileType.Waste, index: 0 },
        };
        const game = mockGame([], [waste], [], [foundation]);

        expect(rules.isValidMove(game, move)).toBe(false);
      });

      it('should not allow a card to move to foundation pile where top card is not one rank higher', () => {
        const card = cardOf(Rank.K, Suit.Spades, true);
        const waste = pileOf(card);
        const foundation = pileOf(cardOf(Rank.A, Suit.Spades));
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: {
            type: PileType.Foundation,
            index: 0,
          },
          origin: { type: PileType.Waste, index: 0 },
        };
        const game = mockGame([], [waste], [], [foundation]);

        expect(rules.isValidMove(game, move)).toBe(false);
      });

      it('should not allow a card to move to foundation pile where top card is different suit', () => {
        const card = cardOf(Rank.Two, Suit.Spades, true);
        const waste = pileOf(card);
        const foundation = pileOf(cardOf(Rank.A, Suit.Hearts));
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: {
            type: PileType.Foundation,
            index: 0,
          },
          origin: { type: PileType.Waste, index: 0 },
        };
        const game = mockGame([], [waste], [], [foundation]);

        expect(rules.isValidMove(game, move)).toBe(false);
      });

      it('should not allow a card to move to the foundation pile if not the top card', () => {
        const card = cardOf(Rank.Two, Suit.Spades, true);
        const waste = pileOf(card, cardOf(Rank.A, Suit.Spades));
        const foundation = pileOf(cardOf(Rank.A, Suit.Spades));
        const move: MoveDto = {
          serializedCard: card.serialize(),
          destination: {
            type: PileType.Foundation,
            index: 0,
          },
          origin: { type: PileType.Waste, index: 0 },
        };
        const game = mockGame([], [waste], [], [foundation]);

        expect(rules.isValidMove(game, move)).toBe(false);
      });
    });
  });

  describe('Error moves', () => {
    it('should throw an error when trying to move a card to stock', () => {
      const card = cardOf(Rank.A, Suit.Spades, true);
      const waste = pileOf(card);
      const move: MoveDto = {
        serializedCard: card.serialize(),
        destination: { type: PileType.Stock, index: 0 },
        origin: { type: PileType.Waste, index: 0 },
      };
      const game = mockGame([], [waste]);

      expect(() => rules.isValidMove(game, move)).toThrow(
        'Game rule violated: Cannot move card to stock.',
      );
    });

    it('should throw an error when trying to move a card to waste', () => {
      const card = cardOf(Rank.A, Suit.Spades, true);
      const move: MoveDto = {
        serializedCard: card.serialize(),
        destination: { type: PileType.Waste, index: 0 },
        origin: { type: PileType.Tableau, index: 0 },
      };
      const game = mockGame([], [], [pileOf(card)]);

      expect(() => rules.isValidMove(game, move)).toThrow(
        'Game rule violated: Cannot move card to waste.',
      );
    });
  });

  describe('isWinConditionMet', () => {
    it('should return true when all tableau and waste piles are empty and foundation piles are not empty', () => {
      const game = mockGame([], [], [], [pileOf(cardOf(Rank.A, Suit.Spades))]);
      expect(rules.isWinConditionMet(game)).toBe(true);
    });

    it('should return false when tableau or waste piles are not empty', () => {
      const game = mockGame([pileOf(cardOf(Rank.K, Suit.Spades))], [], [], []);
      expect(rules.isWinConditionMet(game)).toBe(false);
    });

    it('should return false when foundation piles are empty', () => {
      const game = mockGame([], [], [], []);
      expect(rules.isWinConditionMet(game)).toBe(false);
    });
  });
});
