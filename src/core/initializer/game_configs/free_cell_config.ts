import { DeckVariant } from '../../deck';
import { createDeck } from '../../deck/factory/deck.factory';
import { PileType } from '../../pile';
import { GameConfig } from '../game_config.interface';

export function createFreeCellConfig(): GameConfig {
  return {
    deck: createDeck(DeckVariant.Standard),
    toShuffle: true,
    piles: [
      {
        type: PileType.Waste,
        count: 4,
      },
      {
        type: PileType.Tableau,
        count: 8,
        cardsPerPile: [7, 7, 7, 7, 6, 6, 6, 6],
      },
      {
        type: PileType.Foundation,
        count: 4,
      },
    ],
  };
}
