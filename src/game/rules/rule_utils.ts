import { GameRuleError, PileEmptyError } from '../../errors';
import { Card } from '../../models';
import { Pile } from '../../models/pile';

export function isDifferentColor(card: Card, target: Card): boolean {
  return card.color !== target.color;
}

export function isNextLowerRank(card: Card, target: Card): boolean {
  return card.rank - 1 === target.rank;
}

export function isNextHigherRank(card: Card, target: Card): boolean {
  return card.rank + 1 === target.rank;
}

export function isSameSuit(card: Card, target: Card): boolean {
  return card.suit === target.suit;
}

export function isTopCard(pile: Pile, target: Card): boolean {
  let topCard: Card;
  try {
    topCard = pile.peek();
  } catch (error) {
    if (error instanceof PileEmptyError) {
      throw new GameRuleError('Cannot move card from empty pile.');
    } else throw error;
  }
  return topCard.equals(target);
}
