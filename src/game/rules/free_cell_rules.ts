import { Game } from '../game';
import { GameRules, MoveDto } from './game_rules';

export class FreeCellRules implements GameRules {
  isValidMove(move: MoveDto): boolean {
    // Implement the logic to check if the move is valid in Solitaire
    return true; // Placeholder, implement actual logic
  }

  isWinConditionMet(gameState: Game): boolean {
    // Implement the logic to check if the win condition is met in Solitaire
    return false; // Placeholder, implement actual logic
  }
}
