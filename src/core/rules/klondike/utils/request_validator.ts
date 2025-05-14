import { MoveRequest, PileReference } from '../../../../dto';
import { GameRuleError } from '../../../../errors';
import { Card } from '../../../card';
import { Pile } from '../../../pile';

export function validateMoveRequest(move: MoveRequest) {
  const { origin, destination } = move;
  if (origin.type === destination.type && origin.index === destination.index) {
    throw new GameRuleError(
      `Cannot move card to its origin pile: ${origin.type} ${origin.index}`,
    );
  }
}

export function getValidCard(
  cardIndex: number,
  pile: Pile,
  pileReference: PileReference,
): Card {
  if (pile.isEmpty) {
    throw new GameRuleError(
      `Cannot move card from empty pile: ${pileReference.type} ${pileReference.index}`,
    );
  }
  if (cardIndex < 0 || cardIndex >= pile.size) {
    throw new GameRuleError(
      `Invalid card index: ${cardIndex} for pile: ${pileReference.type} ${pileReference.index}`,
    );
  }
  return pile.cards[cardIndex];
}
