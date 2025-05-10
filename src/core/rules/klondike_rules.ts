import { GameRuleError } from '../../errors';
import { Card, Rank } from '../card';
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
import { MoveRequest } from '../../dto/move.request';
import { drawFromStockConfig } from './draw_from_stock_config.interface';
import { GameType } from './game_type.enum';

export class KlondikeRules implements GameRules {
  gameType = GameType.Klondike;

  isValidMove(game: Game, move: MoveRequest): boolean {
    const { destination } = move;
    switch (destination.type) {
      case 'tableau':
        return this._canMoveToTableau(game, move);
      case 'foundation':
        return this._canMoveToFoundation(game, move);
      default:
        throw new GameRuleError(`Cannot move card to ${destination.type}.`);
    }
  }

  isWinConditionMet(game: Game): boolean {
    return (
      game.arePilesEmpty(PileType.Tableau) &&
      game.arePilesEmpty(PileType.Waste) &&
      game.arePilesEmpty(PileType.Stock) &&
      !game.arePilesEmpty(PileType.Foundation)
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

  private _canMoveToTableau(game: Game, move: MoveRequest): boolean {
    const { serializedCard, destination, origin } = move;
    const card = Card.deserialize(serializedCard);
    const originPile = game.getPile(origin.type, origin.index);
    const destinationPile = game.getPile(destination.type, destination.index);
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

  private _canMoveToFoundation(game: Game, move: MoveRequest): boolean {
    const { serializedCard, destination, origin } = move;
    const card = Card.deserialize(serializedCard);
    const originPile = game.getPile(origin.type, origin.index);
    const destinationPile = game.getPile(destination.type, destination.index);
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
