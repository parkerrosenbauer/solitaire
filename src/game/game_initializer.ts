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
    const tableauConfig = this.findPileConfig('tableau');
    if (tableauConfig)
      this.deal(tableauConfig.cardsPerPile, this._piles.tableau);
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
    const pileConfig = this._config.piles.find(
      (pile) => pile.type === pileType,
    );
    return pileConfig;
  }

  private deal(cardsPerPile: number[], tableauPiles: Pile[]) {
    console.log(cardsPerPile, tableauPiles);
    for (let i = 0; i < cardsPerPile.length; i++) {
      if (cardsPerPile[i] > i) {
        let card = this._deck.draw();
        console.log(card);
        tableauPiles[i].addCard(card);
      }
    }
  }
}
