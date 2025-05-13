import { DeckVariant } from '../../deck';
import { createDeck } from '../../deck/factory/deck.factory';
import { PileType } from '../../pile';
import { GameConfig } from '../game_config.interface';

export function createKlondikeConfig(): GameConfig {
  return {
    deck: createDeck(DeckVariant.Standard),
    toShuffle: true,
    piles: [
      {
        type: PileType.Stock,
        count: 1,
      },
      {
        type: PileType.Waste,
        count: 1,
      },
      {
        type: PileType.Tableau,
        count: 7,
        cardsPerPile: [1, 2, 3, 4, 5, 6, 7],
        toDeal: true,
        flipTopCard: true,
      },
      {
        type: PileType.Foundation,
        count: 4,
      },
    ],
    remainingCardPile: PileType.Stock,
  };
}
