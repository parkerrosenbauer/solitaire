import { MoveRequest } from '../../dto';
import { GamePlayError } from '../../errors';
import { mockGame } from '../../utils/mocks';
import { Game } from '../game';
import { PileType } from '../pile';
import { GameRules, GameType } from '../rules';
import { GameSession } from './game_session';
import { GameSessionStatus } from './game_session_status.enum';

describe('GameSession', () => {
  let rules: GameRules;
  let move: MoveRequest;
  let game: Game;

  beforeEach(() => {
    game = mockGame({});
    rules = {
      gameType: GameType.Klondike,
      isValidMove: jest.fn().mockReturnValue(true),
      isWinConditionMet: jest.fn().mockReturnValue(false),
      canDrawFromStock: jest.fn().mockReturnValue(true),
      getAllValidMoves: jest.fn(),
      hasAvailableMoves: jest.fn().mockReturnValue(true),
    };
    move = { origin: { type: PileType.Tableau } } as MoveRequest;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('moveCard', () => {
    it('throws if the move is invalid according to the rules', () => {
      const mockIsValidMove = jest.spyOn(rules, 'isValidMove');
      mockIsValidMove.mockReturnValue(false);
      const session = new GameSession(rules, game);

      expect(() => session.moveCard(move)).toThrow(GamePlayError);
    });

    it('calls drawFromStock if the move is from the stock', () => {
      const game = mockGame({});
      const session = new GameSession(rules, game);
      const drawFromStockSpy = jest.spyOn(session, 'drawFromStock');
      drawFromStockSpy.mockImplementation(() => {});
      move.origin.type = PileType.Stock;
      session.moveCard(move);
      expect(drawFromStockSpy).toHaveBeenCalled();
    });
  });

  describe('drawFromStock', () => {
    it('throws if drawing from stock is not allowed', () => {
      const mockCanDrawFromStock = jest.spyOn(rules, 'canDrawFromStock');
      mockCanDrawFromStock.mockReturnValue(false);
      const session = new GameSession(rules, game);
      expect(() => session.drawFromStock()).toThrow(GamePlayError);
    });

    it('throws if onDrawFromStock is not defined', () => {
      const session = new GameSession(rules, game);
      expect(() => session.drawFromStock()).toThrow(GamePlayError);
    });
  });

  describe('evaluateGameStatus', () => {
    it('sets status to in progres if the game is still in progress', () => {
      const session = new GameSession(rules, game);
      session.evaluateGameStatus();
      expect(session.status).toBe(GameSessionStatus.InProgress);
    });

    it('sets status to won if the win condition is met', () => {
      const mockIsWinConditionMet = jest.spyOn(rules, 'isWinConditionMet');
      mockIsWinConditionMet.mockReturnValue(true);
      const session = new GameSession(rules, game);
      session.evaluateGameStatus();
      expect(session.status).toBe(GameSessionStatus.Won);
    });

    it('sets status to lost if there are no available moves', () => {
      const mockHasAvailableMoves = jest.spyOn(rules, 'hasAvailableMoves');
      mockHasAvailableMoves.mockReturnValue(false);
      const session = new GameSession(rules, game);
      session.evaluateGameStatus();
      expect(session.status).toBe(GameSessionStatus.Lost);
    });
  });

  describe('serialize', () => {
    it('serializes and deserializes game session', () => {
      const session = new GameSession(rules, game);
      const serialized = session.serialize();
      const deserializedSession = GameSession.deserialize(serialized);
      expect(deserializedSession.game).toEqual(session.game);
      expect(deserializedSession.rules.gameType).toEqual(
        session.rules.gameType,
      );
    });
  });
});
