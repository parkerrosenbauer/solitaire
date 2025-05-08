import { GameRuleError } from '../../errors';
import { Rank } from '../../core/card/card';
import { Game } from '../../core/game';
import { GameRules } from './game_rules';
import {
  isDifferentColor,
  isNextHigherRank,
  isNextLowerRank,
  isSameSuit,
  isTopCard,
} from './rule_utils';
import { PileType } from '../pile';
import { MoveDto } from '../../dto/move.dto';
import { drawFromStockConfig } from './draw_from_stock_config.interface';

export class KlondikeRules implements GameRules {
  isValidMove(gameState: Game, move: MoveDto): boolean {
    const { destination } = move;
    switch (destination.type) {
      case 'tableau':
        return this._canMoveToTableau(gameState, move);
      case 'foundation':
        return this._canMoveToFoundation(gameState, move);
      default:
        throw new GameRuleError(`Cannot move card to ${destination.type}.`);
    }
  }

  isWinConditionMet(gameState: Game): boolean {
    return (
      gameState.arePilesEmpty(PileType.Tableau) &&
      gameState.arePilesEmpty(PileType.Waste) &&
      gameState.arePilesEmpty(PileType.Stock) &&
      !gameState.arePilesEmpty(PileType.Foundation)
    );
  }

  canDrawFromStock(): boolean {
    return true;
  }

  onDrawFromStock(): drawFromStockConfig {
    return {
      destination: PileType.Waste,
      flipDrawnCards: true,
      numberOfCards: 1,
      resetStockFromDestination: true,
    };
  }

  private _canMoveToTableau(gameState: Game, move: MoveDto): boolean {
    const { card, destination, origin } = move;
    const originPile = gameState.getPile(origin.type, origin.index);
    const destinationPile = gameState.getPile(
      destination.type,
      destination.index,
    );
    if (!card.isFaceUp) {
      return false;
    } else if (!isTopCard(originPile, card) && origin.type !== 'tableau') {
      return false;
    } else if (destinationPile.isEmpty) {
      return card.rank === Rank.K;
    } else
      return (
        isDifferentColor(destinationPile.peek(), card) &&
        isNextLowerRank(destinationPile.peek(), card)
      );
  }

  private _canMoveToFoundation(gameState: Game, move: MoveDto): boolean {
    const { card, destination, origin } = move;
    const originPile = gameState.getPile(origin.type, origin.index);
    const destinationPile = gameState.getPile(
      destination.type,
      destination.index,
    );
    if (!card.isFaceUp || !isTopCard(originPile, card)) {
      return false;
    } else if (destinationPile.isEmpty) {
      return card.rank === Rank.A;
    } else
      return (
        isSameSuit(destinationPile.peek(), card) &&
        isNextHigherRank(destinationPile.peek(), card)
      );
  }
}
