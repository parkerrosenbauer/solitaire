import { PileType } from '../pile';

export interface PileConfig {
  type: PileType;
  count: number;
  cardsPerPile?: number[];
  toDeal?: boolean;
  flipTopCard?: boolean;
}
