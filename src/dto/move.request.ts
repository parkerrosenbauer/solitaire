import { PileReference } from './pile.reference';

export interface MoveRequest {
  cardIndex: number;
  destination: PileReference;
  origin: PileReference;
}
