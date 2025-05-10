import { Game } from '../../core/game';
import { MoveDto } from '../../dto';
import { drawFromStockConfig } from './draw_from_stock_config.interface';

export interface GameRules {
  gameType: GameType;
  isValidMove(game: Game, move: MoveDto): boolean;
  isWinConditionMet(game: Game): boolean;
  canDrawFromStock(): boolean;
  onDrawFromStock?(): drawFromStockConfig;
}
