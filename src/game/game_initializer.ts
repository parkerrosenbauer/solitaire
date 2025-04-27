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
  remainingCardPile?: PileType;
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
    this.initializePiles();
  }

  setup(): Record<PileType, Pile[]> {
    try {
      this.shuffleDeck();
      this.setupPiles();
      this.handleRemainingCards();
    } catch (error) {
      this.setupRollback();
      if (error instanceof GameSetupError) {
        throw error;
      }
      throw new GameSetupError('unknown error.\n', { cause: error });
    }
    return this._piles;
  }

  private initializePiles() {
    this._piles = {
      stock: [],
      waste: [],
      foundation: [],
      tableau: [],
    };
  }

  private shuffleDeck() {
    if (this._config.toShuffle) this._deck.shuffle();
  }

  private setupPiles() {
    this._config.piles.forEach((pileConfig) => {
      this.createPile(pileConfig);
      this.deal(pileConfig);
      this.flipTopCard(pileConfig);
    });
  }

  private createPile(pile: PileConfig) {
    this._piles[pile.type] = [];
    for (let i = 0; i < pile.count; i++) {
      this._piles[pile.type].push(new Pile());
    }
  }

  private deal(pileConfig: PileConfig) {
    const { toDeal, cardsPerPile, type } = pileConfig;
    if (!toDeal) return;
    if (!cardsPerPile) {
      throw new GameSetupError(
        'cardsPerPile must be specified when toDeal set to true.',
      );
    }
    const piles = this._piles[type];
    let fullPiles = false;
    while (!fullPiles) {
      fullPiles = true;
      for (let i = 0; i < cardsPerPile.length; i++) {
        if (cardsPerPile[i] > piles[i].size) {
          fullPiles = false;
          if (this._deck.isEmpty) {
            throw new GameSetupError(
              'Not enough cards to satisfy pile configs.',
            );
          }
          piles[i].addCard(this._deck.draw());
        }
      }
    }
  }

  private flipTopCard(pileConfig: PileConfig) {
    const { type, flipTopCard } = pileConfig;
    if (!flipTopCard) return;
    const piles = this._piles[type];
    piles.forEach((pile) => {
      if (!pile.peek) {
        throw new GameSetupError('Cannot flip top card of an empty pile.');
      }
      pile.peek.flip();
    });
  }

  private handleRemainingCards() {
    if (this._config.remainingCardPile) {
      const remainingPile = this._piles[this._config.remainingCardPile];

      if (this._deck.isEmpty) {
        throw new GameSetupError(
          `No cards remaining in deck to add to ${this._config.remainingCardPile} pile.`,
        );
      }
      if (remainingPile.length > 1) {
        throw new GameSetupError(
          'More than one pile specified for remaining cards.',
        );
      }

      this._piles[this._config.remainingCardPile][0].cards =
        this._deck.removeAllCards();
    }
  }

  private setupRollback() {
    this._deck.reset();
    this.initializePiles();
  }
}
