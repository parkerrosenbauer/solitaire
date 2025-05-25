import { MoveRequest, PileReference } from '../../../../dto';
import { Card, Rank } from '../../../card';
import { Game } from '../../../game';
import { PileType } from '../../../pile';
import * as RuleUtils from '../../utils';
import * as Utils from '../../../../utils';
import { getValidCard } from './request_validators';

export function canPlaceCardOnCardTableau(
  card: Card,
  destinationCard: Card,
): boolean {
  return (
    RuleUtils.isDifferentColor(destinationCard, card) &&
    RuleUtils.isNextLowerRank(destinationCard, card)
  );
}

export function canPlaceCardOnCardFoundation(
  card: Card,
  destinationCard: Card,
): boolean {
  return (
    RuleUtils.isSameSuit(destinationCard, card) &&
    RuleUtils.isNextHigherRank(destinationCard, card)
  );
}

export function canMoveToTableau(game: Game, move: MoveRequest): boolean {
  const { cardIndex, destination, origin } = move;
  const originPile = game.getPile(origin.type, origin.index);
  const destinationPile = game.getPile(destination.type, destination.index);
  const card = getValidCard(cardIndex, originPile, origin);
  if (!card.isFaceUp) {
    return false;
  } else if (
    !RuleUtils.isTopCard(originPile, cardIndex) &&
    origin.type !== 'tableau'
  ) {
    return false;
  } else if (destinationPile.isEmpty) {
    return RuleUtils.isKing(card);
  } else return canPlaceCardOnCardTableau(card, destinationPile.peek());
}

export function validMoveToTableauIndex(
  game: Game,
  cardIndex: number,
  origin: PileReference,
): number {
  const tableau = game.getPiles(PileType.Tableau);
  for (let i = 0; i < tableau.length; i++) {
    const moveToTableau = Utils.createOriginToTableauRequest(
      cardIndex,
      i,
      origin.type,
      origin.index,
    );
    if (canMoveToTableau(game, moveToTableau)) {
      return i;
    }
  }
  return -1;
}

export function canMoveToFoundation(game: Game, move: MoveRequest): boolean {
  const { cardIndex, destination, origin } = move;
  const originPile = game.getPile(origin.type, origin.index);
  const destinationPile = game.getPile(destination.type, destination.index);
  const card = getValidCard(cardIndex, originPile, origin);
  if (!card.isFaceUp || !RuleUtils.isTopCard(originPile, cardIndex)) {
    return false;
  } else if (destinationPile.isEmpty) {
    return card.rank === Rank.A;
  } else return canPlaceCardOnCardFoundation(card, destinationPile.peek());
}

export function validMoveToFoundationIndex(game: Game, card: Card): number {
  const foundation = game.getPiles(PileType.Foundation);
  for (let i = 0; i < foundation.length; i++) {
    if (foundation[i].isEmpty) {
      if (card.rank === Rank.A) return i;
      continue;
    }
    if (canPlaceCardOnCardFoundation(card, foundation[i].peek())) {
      return i;
    }
  }
  return -1;
}
