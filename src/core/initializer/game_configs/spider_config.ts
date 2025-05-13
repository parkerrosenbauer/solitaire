import { DeckVariant } from '../../deck';
import { createDeck } from '../../deck/factory/deck.factory';
import { PileType } from '../../pile';
import { GameConfig } from '../game_config.interface';

export function createSpiderConfig(): GameConfig {
  return {
    deck: createDeck(DeckVariant.Double),
    toShuffle: true,
    piles: [
      {
        type: PileType.Stock,
        count: 1,
      },
      {
        type: PileType.Tableau,
        count: 10,
        cardsPerPile: [6, 6, 6, 6, 5, 5, 5, 5, 5, 5],
        toDeal: true,
        flipTopCard: true,
      },
      {
        type: PileType.Foundation,
        count: 8,
      },
    ],
    remainingCardPile: PileType.Stock,
  };
}
