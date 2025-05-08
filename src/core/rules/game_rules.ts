import { Game } from '../../core/game';
import { MoveDto } from '../../dto';
import { drawFromStockConfig } from './draw_from_stock_config.interface';

export interface GameRules {
  isValidMove(gameState: Game, move: MoveDto): boolean;
  isWinConditionMet(gameState: Game): boolean;
  canDrawFromStock(): boolean;
  onDrawFromStock?(): drawFromStockConfig;
}
