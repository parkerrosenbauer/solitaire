import { Game } from '../../core/game';
import { GameRules } from './game_rules';
import { MoveDto } from '../../dto';
import { GameType } from './game_type.enum';

export class FreeCellRules implements GameRules {
  gameType = GameType.FreeCell;

  isValidMove(game: Game, move: MoveDto): boolean {
    // Implement the logic to check if the move is valid in Solitaire
    return true; // Placeholder, implement actual logic
  }

  isWinConditionMet(game: Game): boolean {
    // Implement the logic to check if the win condition is met in Solitaire
    return false; // Placeholder, implement actual logic
  }

  canDrawFromStock(): boolean {
    return false;
  }
}
