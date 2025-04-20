import { Pile } from '../models/pile';

export type PileType = 'stock' | 'waste' | 'foundation' | 'tableau';

export interface GameConfig {
  piles: {
    type: PileType;
    count: number;
    cardsPerPile: number[];
    flipTopCard?: boolean;
  }[];
}

interface PileDto {
  stock?: Pile[];
  waste?: Pile[];
  foundation?: Pile[];
  tableau?: Pile[];
}

export class GameInitializer {
  private _config: GameConfig;

  constructor(config: GameConfig) {
    this._config = config;
  }

  setup(): PileDto {
    let pileConfig: PileDto = {};
    this._config.piles.forEach((pile) => {
      pileConfig[pile.type] = [];
      for (let i = 0; i < pile.count; i++) {
        pileConfig[pile.type]!.push(new Pile());
      }
    });
    return pileConfig;
  }
}
