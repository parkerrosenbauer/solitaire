import { GameRuleError } from '../../errors';
import { Rank } from '../../models/card';
import { Game } from '../game';
import { GameRules, MoveDto } from './game_rules';
import {
  isDifferentColor,
  isNextHigherRank,
  isNextLowerRank,
  isSameSuit,
  isTopCard,
} from './rule_utils';

export class SolitaireRules implements GameRules {
  isValidMove(move: MoveDto): boolean {
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

  isWinConditionMet(gameState: Game): boolean {
    return (
      gameState.arePilesEmpty('tableau') &&
      gameState.arePilesEmpty('waste') &&
      gameState.arePilesEmpty('stock') &&
      !gameState.arePilesEmpty('foundation')
    );
  }

  private _canMoveToTableau(move: MoveDto): boolean {
    const { card, destination, origin } = move;
    if (!card.isFaceUp) {
      return false;
    } else if (!isTopCard(origin.pile, card) && origin.type !== 'tableau') {
      return false;
    } else if (destination.pile.isEmpty) {
      return card.rank === Rank.K;
    } else
      return (
        isDifferentColor(destination.pile.peek(), card) &&
        isNextLowerRank(destination.pile.peek(), card)
      );
  }

  private _canMoveToFoundation(move: MoveDto): boolean {
    const { card, destination, origin } = move;
    if (!card.isFaceUp || !isTopCard(origin.pile, card)) {
      return false;
    } else if (destination.pile.isEmpty) {
      return card.rank === Rank.A;
    } else
      return (
        isSameSuit(destination.pile.peek(), card) &&
        isNextHigherRank(destination.pile.peek(), card)
      );
  }
}
