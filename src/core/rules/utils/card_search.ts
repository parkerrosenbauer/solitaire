import { Pile } from '../../pile';

export function findFirstFaceUpCardIndex(pile: Pile): number {
  for (let i = 0; i < pile.size; i++) {
    if (pile.cards[i].isFaceUp) {
      return i;
    }
  }
  return -1;
}
