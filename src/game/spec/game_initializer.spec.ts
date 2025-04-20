import { Pile } from '../../models/pile';
import { GameConfig, PileType, GameInitializer } from '../game_initializer';

describe('GameInitializer', () => {
  const wasteType: PileType = 'waste';
  const wasteConfig = {
    type: wasteType,
    count: 1,
    cardsPerPile: [0],
  };
  const stockType: PileType = 'stock';
  const stockConfig = {
    type: stockType,
    count: 1,
    cardsPerPile: [26],
  };
  const foundationType: PileType = 'foundation';
  const foundationConfig = {
    type: foundationType,
    count: 4,
    cardsPerPile: [0, 0, 0, 0],
  };
  const tableauType: PileType = 'tableau';
  const tableauConfig = {
    type: tableauType,
    count: 7,
    cardsPerPile: [1, 2, 3, 4, 5, 6, 7],
  };

  it('should initialize with no piles when specified', () => {
    const configs: GameConfig = { piles: [] };
    const initializer = new GameInitializer(configs);
    expect(initializer.setup()).toEqual({});
  });

  it('should initialize with a waste pile when specified', () => {
    const configs: GameConfig = {
      piles: [wasteConfig],
    };
    const initializer = new GameInitializer(configs);
    const { waste } = initializer.setup();
    expect(waste!.length).toBe(1);
    expect(waste![0]).toBeInstanceOf(Pile);
  });

  it('should initialize the stock pile when specified', () => {
    const configs: GameConfig = {
      piles: [wasteConfig, stockConfig],
    };
    const initializer = new GameInitializer(configs);
    const { stock } = initializer.setup();
    expect(stock![0]).toBeInstanceOf(Pile);
  });
});
