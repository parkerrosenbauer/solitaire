import { Deck } from '../../models';
import { Card, Rank, Suit } from '../../models/card';
import { GameConfig, GameInitializer } from '../game_initializer';

describe('GameInitializer', () => {
  let emptyConfigs: GameConfig;
  let solitaireConfigs: GameConfig;
  let freeCellConfigs: GameConfig;
  const mockCardDeck: Card[] = [];
  const suits = Object.values(Suit) as Array<Suit>;
  const ranks = Object.values(Rank).filter(
    (value) => typeof value === 'number',
  ) as Array<Rank>;

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      mockCardDeck.push(new Card(suit, rank));
    });
  });

  beforeEach(() => {
    emptyConfigs = {
    deck: new Deck([]),
    toShuffle: false,
    piles: [],
  };
    solitaireConfigs = {
      deck: new Deck([...mockCardDeck]),
    toShuffle: true,
    piles: [
      {
        type: 'waste',
        count: 1,
        cardsPerPile: [0],
      },
        {
          type: 'tableau',
          count: 7,
          cardsPerPile: [1, 2, 3, 4, 5, 6, 7],
          flipTopCard: true,
        },
      {
        type: 'stock',
        count: 1,
          cardsPerPile: [24],
      },
      {
        type: 'foundation',
        count: 4,
        cardsPerPile: [0, 0, 0, 0],
      },
      ],
    };
    freeCellConfigs = {
      deck: new Deck([...mockCardDeck]),
      toShuffle: true,
      piles: [
        {
          type: 'waste',
          count: 4,
          cardsPerPile: [0, 0, 0, 0],
        },
      {
        type: 'tableau',
          count: 8,
          cardsPerPile: [7, 7, 7, 7, 6, 6, 6, 6],
        },
        {
          type: 'foundation',
          count: 4,
          cardsPerPile: [0, 0, 0, 0],
      },
    ],
  };
  });

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

  it('should deal the specified cards to the indicated piles', () => {
    const solitaireInitializer = new GameInitializer(solitaireConfigs);
    const { tableau, stock } = solitaireInitializer.setup();
    expect(tableau.length).toBe(7);
    expect(tableau[0].size).toBe(1);
    expect(tableau[6].size).toBe(7);
  });
});
