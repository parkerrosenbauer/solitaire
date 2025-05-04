import { Card } from '../models';
import { Rank } from '../models/card';
import { Pile } from '../models/pile';
import { Game } from './game';
import { PileType } from './game_initializer';

export interface MoveDto {
  card: Card;
  destinationType: PileType;
  destinationIdx: number;
  originType: PileType;
  originIdx: number;
}

export class GameRules {
  private _game: Game;

  constructor(game: Game) {
    this._game = game;
  }

  private getPile(type: PileType, index: number): Pile {
    return this._game.getPile(type, index);
  }

  isWinConditionMet(): boolean {
    return (
      this._game.arePilesEmpty('tableau') &&
      this._game.arePilesEmpty('waste') &&
      this._game.arePilesEmpty('stock') &&
      !this._game.arePilesEmpty('foundation')
    );
  }

  canMoveToTableau(move: MoveDto): boolean {
    const { card, destinationIdx } = move;
    if (!card.isFaceUp) return false;
    const tableau = this.getPile('tableau', destinationIdx);
    if (tableau.isEmpty && card.rank === Rank.K) return true;
    if (
      tableau.peek.color !== card.color &&
      tableau.peek.rank - 1 === card.rank
    )
      return true;
    return false;
  }

  canMoveToFoundation(move: MoveDto): boolean {
    const { card, destinationIdx, originIdx, originType } = move;
    if (!card.isFaceUp || !this._game.isTopCard(card, originType, originIdx))
      return false;
    const foundation = this.getPile('foundation', destinationIdx);
    if (foundation.isEmpty && card.rank === Rank.A) return true;
    if (
      foundation.peek.color === card.color &&
      foundation.peek.rank + 1 === card.rank
    )
      return true;
    return false;
  }

  canMoveToWaste(move: MoveDto): boolean {
    return move.originType === 'stock';
  }
}
