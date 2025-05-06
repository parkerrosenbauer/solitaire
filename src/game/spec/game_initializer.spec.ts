import { Deck } from '../../models';
import { Card, Color, Rank, Suit } from '../../models/card';
import { GameConfig, GameInitializer } from '../game_initializer';

describe('GameInitializer', () => {
  let emptyConfigs: GameConfig;
  let configs: GameConfig;
  let mockCardDeck: Deck;
  const cards: Card[] = [];
  const suits = Object.values(Suit) as Array<Suit>;
  const ranks = Object.values(Rank).filter(
    (value) => typeof value === 'number',
  ) as Array<Rank>;

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      let color = Color.Red;
      if (suit === 'spades' || suit === 'clubs') color = Color.Black;
      cards.push(new Card(suit, rank, color));
    });
  });

  beforeEach(() => {
    mockCardDeck = new Deck([...cards]);
    emptyConfigs = {
      deck: new Deck([]),
      toShuffle: false,
      piles: [],
    };
    configs = {
      deck: mockCardDeck,
      toShuffle: true,
      piles: [
        {
          type: 'waste',
          count: 1,
        },
        {
          type: 'tableau',
          count: 7,
          cardsPerPile: [1, 2, 3, 4, 5, 6, 7],
          flipTopCard: true,
          toDeal: true,
        },
        {
          type: 'stock',
          count: 1,
        },
        {
          type: 'foundation',
          count: 4,
        },
      ],
      remainingCardPile: 'stock',
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
    const initializer = new GameInitializer(configs);
    const { tableau, stock } = initializer.setup();
    expect(tableau.length).toBe(7);
    expect(tableau[0].size).toBe(1);
    expect(tableau[6].size).toBe(7);
    expect(stock[0].size).toBe(24);
  });

  it('should throw an error if sum of cardsPerPile exceeds deck size', () => {
    const errorConfigs: GameConfig = {
      deck: mockCardDeck,
      toShuffle: true,
      piles: [
        {
          type: 'stock',
          count: 1,
          cardsPerPile: [53],
          toDeal: true,
        },
      ],
    };
    const initializer = new GameInitializer(errorConfigs);
    expect(() => initializer.setup()).toThrow(
      'Game setup failed: Not enough cards to satisfy pile configs.',
    );
  });

  it('should throw an error if remainingCardPile is set but no cards remain', () => {
    const errorConfigs: GameConfig = {
      deck: mockCardDeck,
      toShuffle: true,
      piles: [
        {
          type: 'tableau',
          count: 1,
          cardsPerPile: [52],
          toDeal: true,
        },
        {
          type: 'stock',
          count: 1,
        },
      ],
      remainingCardPile: 'stock',
    };
    const initializer = new GameInitializer(errorConfigs);
    expect(() => initializer.setup()).toThrow(
      'Game setup failed: No cards remaining in deck to add to stock pile.',
    );
  });

  it('should throw an error if toDeal is set to true but cardsPerPile is omitted', () => {
    const errorConfigs: GameConfig = {
      deck: mockCardDeck,
      toShuffle: true,
      piles: [
        {
          type: 'tableau',
          count: 1,
          toDeal: true,
        },
      ],
    };
    const initializer = new GameInitializer(errorConfigs);
    expect(() => initializer.setup()).toThrow(
      'Game setup failed: cardsPerPile must be specified when toDeal set to true.',
    );
  });

  it('should flip the top card to face up when specified', () => {
    const initializer = new GameInitializer(configs);
    const { tableau } = initializer.setup();
    expect(tableau[0].peek()?.isFaceUp).toEqual(true);
  });

  it('should throw an error when attempting to flip top card of an empty pile', () => {
    const originalCards = [...cards];
    const errorConfigs: GameConfig = {
      deck: mockCardDeck,
      toShuffle: true,
      piles: [
        {
          type: 'waste',
          count: 1,
          cardsPerPile: [0],
          flipTopCard: true,
        },
      ],
    };
    const initializer = new GameInitializer(errorConfigs);
    expect(() => initializer.setup()).toThrow(
      'Game setup failed: Cannot flip top card of an empty pile.',
    );
    expect(mockCardDeck.cards).toEqual(originalCards);
  });

  it('should shuffle the cards when indicated', () => {
    const mockShuffle = jest.spyOn(Deck.prototype, 'shuffle');
    const initializer = new GameInitializer(configs);
    initializer.setup();
    expect(mockShuffle).toHaveBeenCalled();
  });

  it('should not shuffle the cards when indicated', () => {
    const originalCards = [...cards];
    const unshuffledConfigs: GameConfig = {
      deck: mockCardDeck,
      toShuffle: false,
      piles: [
        {
          type: 'stock',
          count: 1,
          cardsPerPile: [52],
        },
      ],
      remainingCardPile: 'stock',
    };
    const initializer = new GameInitializer(unshuffledConfigs);
    const { stock } = initializer.setup();
    expect(stock[0].cards).toEqual(originalCards);
  });
});
