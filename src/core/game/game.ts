import { GameError } from '../../errors';
import { Pile } from '../pile/pile';
import { PileType } from '../pile';
import { SerializedGame } from './game.serialized';

export class Game {
  private _piles: Record<PileType, Pile[]>;

  constructor(piles: Record<PileType, Pile[]>) {
    this._piles = piles;
  }

  getPiles(type: PileType): Pile[] {
    return this._piles[type].map((pile) => new Pile([...pile.cards]));
  }

  getPile(type: PileType, index: number): Pile {
    if (this._piles[type].length <= index) {
      throw new GameError(`No pile exists at index ${index}.`);
    }
    return new Pile([...this._piles[type][index].cards]);
  }

  getMutablePiles(type: PileType): Pile[] {
    return this._piles[type];
  }

  getMutablePile(type: PileType, index: number): Pile {
    if (this._piles[type].length <= index) {
      throw new GameError(`No pile exists at index ${index}.`);
    }
    return this._piles[type][index];
  }

  arePilesEmpty(type: PileType): boolean {
    for (let pile of this._piles[type]) {
      if (!pile.isEmpty) return false;
    }
    return true;
  }

  serialize(): SerializedGame {
    return {
      stock: this.getPiles(PileType.Stock).map((pile) => pile.serialize()),
      waste: this.getPiles(PileType.Waste).map((pile) => pile.serialize()),
      tableau: this.getPiles(PileType.Tableau).map((pile) => pile.serialize()),
      foundation: this.getPiles(PileType.Foundation).map((pile) =>
        pile.serialize(),
      ),
    };
  }

  static deserialize(game: SerializedGame): Game {
    return new Game({
      stock: game.stock.map((pile) => Pile.deserialize(pile)),
      waste: game.waste.map((pile) => Pile.deserialize(pile)),
      tableau: game.tableau.map((pile) => Pile.deserialize(pile)),
      foundation: game.foundation.map((pile) => Pile.deserialize(pile)),
    });
  }
}
