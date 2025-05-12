import { Game } from '../../core/game';
import { MoveRequest } from '../../dto';
import { DrawFromStockConfig } from './draw_from_stock_config.interface';
import { GameType } from './game_type.enum';

export interface GameRules {
  gameType: GameType;
  isValidMove(game: Game, move: MoveDto): boolean;
  isWinConditionMet(game: Game): boolean;
  canDrawFromStock(): boolean;
  onDrawFromStock?(): drawFromStockConfig;
}
