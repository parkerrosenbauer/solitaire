import { Deck } from '../../models';
import { Card, Rank, Suit } from '../../models/card';
import { GameConfig, GameInitializer } from '../game_initializer';

describe('GameInitializer', () => {
  const cards: Card[] = [];
  const suits = Object.values(Suit) as Array<Suit>;
  const ranks = Object.values(Rank).filter(
    (value) => typeof value === 'number',
  ) as Array<Rank>;

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      cards.push(new Card(suit, rank));
    });
  });
  const emptyConfigs: GameConfig = {
    deck: new Deck([]),
    toShuffle: false,
    piles: [],
  };
  const configs: GameConfig = {
    deck: new Deck(cards),
    toShuffle: true,
    piles: [
      {
        type: 'waste',
        count: 1,
        cardsPerPile: [0],
      },
      {
        type: 'stock',
        count: 1,
        cardsPerPile: [26],
      },
      {
        type: 'foundation',
        count: 4,
        cardsPerPile: [0, 0, 0, 0],
      },
      {
        type: 'tableau',
        count: 7,
        cardsPerPile: [1, 2, 3, 4, 5, 6, 7],
      },
    ],
  };

  it('should initialize with no piles when specified', () => {
    const initializer = new GameInitializer(emptyConfigs);
    const { waste, stock, foundation, tableau } = initializer.setup();
    expect(waste).toEqual([]);
    expect(stock).toEqual([]);
    expect(foundation).toEqual([]);
    expect(tableau).toEqual([]);
  });

  it('should initialize with the correct number of piles', () => {
    const initializer = new GameInitializer(configs);
    const { waste, stock, foundation, tableau } = initializer.setup();
    expect(waste.length).toBe(1);
    expect(stock.length).toBe(1);
    expect(foundation.length).toBe(4);
    expect(tableau.length).toBe(7);
  });

  it('should deal the specified cards to the tableau piles', () => {
    const initializer = new GameInitializer(configs);
    const { tableau } = initializer.setup();
    expect(tableau[0].size).toBe(1);
    expect(tableau[6].size).toBe(7);
  });
});
