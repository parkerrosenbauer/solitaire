import { Card } from '../../models';
import { Pile } from '../../models/pile';
import { Game } from '../game';
import { PileType } from '../game_initializer';

export interface PileDto {
  type: PileType;
  index: number;
  pile: Pile;
}

export interface MoveDto {
  card: Card;
  destination: PileDto;
  origin: PileDto;
}

export interface GameRules {
  isValidMove(move: MoveDto): boolean;
  isWinConditionMet(gameState: Game): boolean;
}
