import { Deck } from '../deck';
import { PileType } from '../pile';
import { PileConfig } from './pile_config.interface';

export interface GameConfig {
  deck: Deck;
  toShuffle: boolean;
  piles: PileConfig[];
  remainingCardPile?: PileType;
}
