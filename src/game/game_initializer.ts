import { Deck } from '../models';
import { Pile } from '../models/pile';

export type PileType = 'stock' | 'waste' | 'foundation' | 'tableau';

export interface PileConfig {
  type: PileType;
  count: number;
  cardsPerPile: number[];
  flipTopCard?: boolean;
}
export interface GameConfig {
  deck: Deck;
  toShuffle: boolean;
  piles: PileConfig[];
}

interface PileDto {
  stock: Pile[];
  waste: Pile[];
  foundation: Pile[];
  tableau: Pile[];
}

export class GameInitializer {
  private _config: GameConfig;
  private _deck: Deck;
  private _toShuffle: boolean;
  private _piles: PileDto = {
    stock: [],
    waste: [],
    foundation: [],
    tableau: [],
  };

  constructor(config: GameConfig) {
    this._config = config;
    this._deck = config.deck;
    this._toShuffle = config.toShuffle;
  }

  setup(): PileDto {
    if (this._toShuffle) this._deck.shuffle();
    this.createPiles();
    this.deal(
      this.findPileConfig('tableau')!.cardsPerPile,
      this._piles.tableau,
    );
    return this._piles;
  }

  private createPiles() {
    this._config.piles.forEach((pile) => {
      for (let i = 0; i < pile.count; i++) {
        this._piles[pile.type].push(new Pile());
      }
    });
  }

  private findPileConfig(pileType: PileType): PileConfig | undefined {
    this._config.piles.forEach((pile) => {
      if (pile.type == pileType) {
        console.log('match');
        return pile;
      }
    });
    return undefined;
  }

  private deal(cardsPerPile: number[], tableauPiles: Pile[]) {
    for (let i = 0; i < cardsPerPile.length; i++) {
      if (cardsPerPile[i] > i) {
        tableauPiles[i].addCard(this._deck.draw());
      }
    }
  }
}
