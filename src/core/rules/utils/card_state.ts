import { Pile } from '../../pile';

export function isTopCard(pile: Pile, targetIndex: number): boolean {
  return pile.size - 1 === targetIndex;
}
