import { MoveRequest } from '../../dto';
import { GamePlayError } from '../../errors';
import { GameEngine } from '../engine';
import { Game } from '../game';
import { PileType } from '../pile';
import { GameRules } from '../rules';
import { createGameRules } from '../rules/factory/game_rules.factory';
import { SerializedGameSession } from './game_session.serialized';
import { GameSessionStatus } from './game_session_status.enum';

export class GameSession {
  public readonly engine: GameEngine;
  private _status: GameSessionStatus = GameSessionStatus.InProgress;

  get status(): GameSessionStatus {
    return this._status;
  }

  constructor(
    public readonly rules: GameRules,
    public readonly game: Game,
  ) {
    this.engine = new GameEngine(game);
  }

  moveCard(move: MoveRequest) {
    if (move.origin.type === PileType.Stock) {
      this.drawFromStock();
    } else {
      if (!this.rules.isValidMove(this.game, move)) {
        throw new GamePlayError('Invalid move according to the rules.');
      }
      this.engine.moveCard(move);
      this.evaluateGameStatus();
    }
  }

  drawFromStock() {
    if (!this.rules.canDrawFromStock()) {
      throw new GamePlayError('Cannot draw from stock according to the rules.');
    }
    if (!this.rules.onDrawFromStock) {
      throw new GamePlayError(
        'onDrawFromStock must be defined if canDrawFromStock is true.',
      );
    }
    this.engine.drawFromStock(this.rules.onDrawFromStock());
  }

  evaluateGameStatus() {
    if (this.rules.isWinConditionMet(this.game)) {
      this._status = GameSessionStatus.Won;
    } else if (!this.rules.hasAvailableMoves(this.game)) {
      this._status = GameSessionStatus.Lost;
    } else this._status = GameSessionStatus.InProgress;
  }

  serialize(): SerializedGameSession {
    return {
      game: this.game.serialize(),
      gameType: this.rules.gameType,
    };
  }

  static deserialize(serialized: SerializedGameSession): GameSession {
    const game = Game.deserialize(serialized.game);
    const rules = createGameRules(serialized.gameType);
    return new GameSession(rules, game);
  }
}
