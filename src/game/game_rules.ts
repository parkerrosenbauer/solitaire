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

  canMoveCard(move: MoveDto): boolean {
    const { destination } = move;

    switch (destination.type) {
      case 'tableau':
        return this._canMoveToTableau(move);
      case 'foundation':
        return this._canMoveToFoundation(move);
      default:
        throw new GameRuleError(`Cannot move card to ${destination.type}.`);
    }
  }

  isWinConditionMet(): boolean {
    return (
      this._game.arePilesEmpty('tableau') &&
      this._game.arePilesEmpty('waste') &&
      this._game.arePilesEmpty('stock') &&
      !this._game.arePilesEmpty('foundation')
    );
  }

  private _canMoveToTableau(move: MoveDto): boolean {
    const { card, count, destination, origin } = move;
    if (!card.isFaceUp) return false;
    if (count > 1 && origin.type !== 'tableau') return false;
    const tableau = this._getPile('tableau', destination.index);
    if (tableau.isEmpty) return card.rank === Rank.K;
    if (
      tableau.peek.color !== card.color &&
      tableau.peek.rank - 1 === card.rank
    )
      return true;
    return false;
  }

  private _canMoveToFoundation(move: MoveDto): boolean {
    const { card, count, destination } = move;
    if (!card.isFaceUp || count !== 1) return false;
    const foundation = this._getPile('foundation', destination.index);
    if (foundation.isEmpty) return card.rank === Rank.A;
    if (
      foundation.peek.color === card.color &&
      foundation.peek.rank + 1 === card.rank
    )
      return true;
    return false;
  }
}
