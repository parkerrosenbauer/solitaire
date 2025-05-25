import { Pile } from '../../pile';
import { Rank, Card } from '../../card';

export function isTopCard(pile: Pile, targetIndex: number): boolean {
  return pile.size - 1 === targetIndex;
}

export function isAce(card: Card): boolean {
  return card.rank === Rank.A;
}

export function isKing(card: Card): boolean {
  return card.rank === Rank.K;
}
