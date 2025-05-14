import { MoveRequest } from '../../../dto';
import { GameRuleError } from '../../../errors';
import { Game } from '../../game';
import { PileType } from '../../pile';
import { DrawFromStockConfig } from '../draw_from_stock_config.interface';
import { GameRules } from '../game_rules';
import { GameType } from '../game_type.enum';
import * as KlondikeUtils from './utils';

export class KlondikeRules implements GameRules {
  gameType = GameType.Klondike;

  isValidMove(game: Game, move: MoveRequest): boolean {
    KlondikeUtils.validateMoveRequest(move);
    const { destination } = move;
    switch (destination.type) {
      case PileType.Tableau:
        return KlondikeUtils.canMoveToTableau(game, move);
      case PileType.Foundation:
        return KlondikeUtils.canMoveToFoundation(game, move);
      default:
        throw new GameRuleError(`Cannot move card to ${destination.type}.`);
    }
  }

  isWinConditionMet(game: Game): boolean {
    for (let i = 0; i < game.getPiles(PileType.Foundation).length; i++) {
      if (game.getPile(PileType.Foundation, i).size !== 13) {
        return false;
      }
    }
    return (
      game.arePilesEmpty(PileType.Tableau) &&
      game.arePilesEmpty(PileType.Waste) &&
      game.arePilesEmpty(PileType.Stock)
    );
  }

  getAllValidMoves(game: Game): MoveRequest[] {
    const moves: MoveRequest[] = [];
    moves.push(...KlondikeUtils.getValidMovesFromTableau(game));
    moves.push(...KlondikeUtils.getValidMovesFromFoundation(game));
    moves.push(...KlondikeUtils.getValidMovesFromWaste(game));
    if (moves.length > 0) return moves;
    return KlondikeUtils.getValidMovesFromStock(game);
  }

  hasAvailableMoves(game: Game): boolean {
    return this.getAllValidMoves(game).length > 0;
  }

  canDrawFromStock(): boolean {
    return true;
  }

  onDrawFromStock(): DrawFromStockConfig {
    return {
      destination: PileType.Waste,
      flipDrawnCards: true,
      numberOfCards: 1,
      resetStockFromDestination: true,
    };
  }
}
