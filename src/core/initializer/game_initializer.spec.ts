import { Deck } from '../deck';
import { createStandardDeck } from '../deck/variants';
import { PileType } from '../pile';
import { GameConfig } from './game_config.interface';
import { GameInitializer } from './game_initializer';

describe('GameInitializer', () => {
  let emptyConfigs: GameConfig;
  let configs: GameConfig;
  let deck: Deck;

  beforeEach(() => {
    deck = createStandardDeck();
    emptyConfigs = {
      deck: new Deck([]),
      toShuffle: false,
      piles: [],
    };
    configs = {
      deck: deck,
      toShuffle: true,
      piles: [
        {
          type: PileType.Waste,
          count: 1,
        },
        {
          type: PileType.Tableau,
          count: 7,
          cardsPerPile: [1, 2, 3, 4, 5, 6, 7],
          flipTopCard: true,
          toDeal: true,
        },
        {
          type: PileType.Stock,
          count: 1,
        },
        {
          type: PileType.Foundation,
          count: 4,
        },
      ],
      remainingCardPile: PileType.Stock,
    };
  });

  it('initializes with no piles when specified', () => {
    const initializer = new GameInitializer(emptyConfigs);
    const { waste, stock, foundation, tableau } = initializer.setup();
    expect(waste).toEqual([]);
    expect(stock).toEqual([]);
    expect(foundation).toEqual([]);
    expect(tableau).toEqual([]);
  });

  it('initializes with the correct number of piles per type', () => {
    const initializer = new GameInitializer(configs);
    const { waste, stock, foundation, tableau } = initializer.setup();
    expect(waste.length).toBe(1);
    expect(stock.length).toBe(1);
    expect(foundation.length).toBe(4);
    expect(tableau.length).toBe(7);
  });

  it('deals specified cards to piles', () => {
    const initializer = new GameInitializer(configs);
    const { tableau, stock } = initializer.setup();
    expect(tableau.length).toBe(7);
    expect(tableau[0].size).toBe(1);
    expect(tableau[6].size).toBe(7);
    expect(stock[0].size).toBe(24);
  });

  it('throws if sum of cardsPerPile exceeds deck size', () => {
    configs.piles[2] = {
      type: PileType.Stock,
      count: 1,
      cardsPerPile: [53],
      toDeal: true,
    };
    const initializer = new GameInitializer(configs);
    expect(() => initializer.setup()).toThrow(
      'Game setup failed: Not enough cards to satisfy pile configs.',
    );
  });

  it('throws if remainingCardPile is set but no cards remain', () => {
    configs.piles[1] = {
      type: PileType.Tableau,
      count: 1,
      cardsPerPile: [52],
      toDeal: true,
    };
    const initializer = new GameInitializer(configs);
    expect(() => initializer.setup()).toThrow(
      'Game setup failed: No cards remaining in deck to add to stock pile.',
    );
  });

  it('throws if toDeal is set to true but cardsPerPile is omitted', () => {
    configs.piles[1] = {
      type: PileType.Tableau,
      count: 1,
      toDeal: true,
    };
    const initializer = new GameInitializer(configs);
    expect(() => initializer.setup()).toThrow(
      'Game setup failed: cardsPerPile must be specified when toDeal set to true.',
    );
  });

  it('flips top card to face up when specified', () => {
    const initializer = new GameInitializer(configs);
    const { tableau } = initializer.setup();
    expect(tableau[0].peek().isFaceUp).toBe(true);
    expect(tableau[1].peek().isFaceUp).toBe(true);
    expect(tableau[2].peek().isFaceUp).toBe(true);
    expect(tableau[3].peek().isFaceUp).toBe(true);
    expect(tableau[4].peek().isFaceUp).toBe(true);
    expect(tableau[5].peek().isFaceUp).toBe(true);
    expect(tableau[6].peek().isFaceUp).toBe(true);
  });

  it('throws when attempting to flip top card of an empty pile', () => {
    const originalCards = [...deck.cards];
    configs.piles[0] = {
      type: PileType.Waste,
      count: 1,
      cardsPerPile: [0],
      flipTopCard: true,
    };
    const initializer = new GameInitializer(configs);
    expect(() => initializer.setup()).toThrow(
      'Game setup failed: Cannot flip top card of an empty pile.',
    );
    expect(deck.cards).toEqual(originalCards);
  });

  it('shuffles when indicated', () => {
    const mockShuffle = jest.spyOn(Deck.prototype, 'shuffle');
    const initializer = new GameInitializer(configs);
    initializer.setup();
    expect(mockShuffle).toHaveBeenCalled();
  });

  it('does not shuffle when indicated', () => {
    const originalCards = [...deck.cards];
    configs.toShuffle = false;
    configs.piles = [{ type: PileType.Stock, count: 1 }];
    const initializer = new GameInitializer(configs);
    const { stock } = initializer.setup();
    expect(stock[0].cards).toEqual(originalCards);
  });
});
