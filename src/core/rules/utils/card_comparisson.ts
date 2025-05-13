import { Card } from '../../card';

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
