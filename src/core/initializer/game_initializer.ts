import { GameSetupError } from '../../errors';
import { Deck } from '../deck';
import { Pile, PileType } from '../pile';
import { GameConfig } from './game_config.interface';
import { PileConfig } from './pile_config.interface';

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
    this._initializePiles();
  }

  setup(): Record<PileType, Pile[]> {
    try {
      this._shuffleDeck();
      this._setupPiles();
      this._handleRemainingCards();
    } catch (error) {
      this._setupRollback();
      if (error instanceof GameSetupError) {
        throw error;
      }
      throw new GameSetupError('unknown error.\n', { cause: error });
    }
    return this._piles;
  }

  private _initializePiles() {
    this._piles = {
      stock: [],
      waste: [],
      foundation: [],
      tableau: [],
    };
  }

  private _shuffleDeck() {
    if (this._config.toShuffle) this._deck.shuffle();
  }

  private _setupPiles() {
    this._config.piles.forEach((pileConfig) => {
      this._createPile(pileConfig);
      this._deal(pileConfig);
      this._flipTopCard(pileConfig);
    });
  }

  private _createPile(pileConfig: PileConfig) {
    const { type, count } = pileConfig;
    this._piles[type] = [];
    for (let i = 0; i < count; i++) {
      this._piles[type].push(new Pile());
    }
  }

  private _deal(pileConfig: PileConfig) {
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

  private _flipTopCard(pileConfig: PileConfig) {
    const { type, flipTopCard } = pileConfig;
    if (!flipTopCard) return;

    const piles = this._piles[type];
    piles.forEach((pile) => {
      if (pile.isEmpty) {
        throw new GameSetupError('Cannot flip top card of an empty pile.');
      }
      pile.getMutableCard(pile.size - 1).flip();
    });
  }

  private _handleRemainingCards() {
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

  private _setupRollback() {
    this._deck.reset();
    this._initializePiles();
  }
}
