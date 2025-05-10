import { SerializedCard } from '../core/card/card.serialize';
import { PileReference } from './pile.reference';

export interface MoveRequest {
  serializedCard: SerializedCard;
  destination: PileReference;
  origin: PileReference;
}
