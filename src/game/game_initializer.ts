import { DeckEmptyError, GameSetupError } from '../errors';
import { Deck } from '../models';
import { Pile } from '../models/pile';

export type PileType = 'stock' | 'waste' | 'foundation' | 'tableau';

export interface PileConfig {
  type: PileType;
  count: number;
  cardsPerPile?: number[];
  toDeal?: boolean;
  flipTopCard?: boolean;
}
export interface GameConfig {
  deck: Deck;
  toShuffle: boolean;
  piles: PileConfig[];
}

export class GameInitializer {
  private _config: GameConfig;
  private _deck: Deck;
  private _piles: Record<PileType, Pile[]> = {
    stock: [],
    waste: [],
    foundation: [],
    tableau: [],
  };

  constructor(config: GameConfig) {
    this._config = config;
    this._deck = config.deck;
  }

  setup(): Record<PileType, Pile[]> {
    if (this._config.toShuffle) this._deck.shuffle();
    try {
      this.createPiles();
    } catch (error) {
      this._deck.reset();
      this._piles = {
        stock: [],
        waste: [],
        foundation: [],
        tableau: [],
      };
      if (error instanceof GameSetupError) {
        throw error;
      }
      throw new GameSetupError('unknown error.\n', { cause: error });
    }
    return this._piles;
  }

  private createPiles() {
    this._config.piles.forEach((pile) => {
      this._piles[pile.type] = [];
      for (let i = 0; i < pile.count; i++) {
        this._piles[pile.type].push(new Pile());
      }

      this.deal(pile.cardsPerPile, this._piles[pile.type]);
      if (pile.flipTopCard) {
        this.flipTopCard(this._piles[pile.type]);
      }
    });
  }

  private deal(cardsPerPile: number[], piles: Pile[]) {
    let fullPiles = false;
    while (!fullPiles) {
      fullPiles = true;
      for (let i = 0; i < cardsPerPile.length; i++) {
        if (cardsPerPile[i] > piles[i].size) {
          fullPiles = false;
          try {
            piles[i].addCard(this._deck.draw());
          } catch (error) {
            if (error instanceof DeckEmptyError) {
              throw new Error('Not enough cards to satisfy pile configs.');
            }
            throw error;
          }
        }
      }
    }
  }

  private flipTopCard(piles: Pile[]) {
    piles.forEach((pile) => {
      if (!pile.peek) {
        throw new Error('Cannot flip top card of an empty pile.');
      }
      pile.peek.flip();
    });
  }
}
