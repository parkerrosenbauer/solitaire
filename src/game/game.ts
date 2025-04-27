import { GameError } from '../errors';
import { Pile } from '../models/pile';
import { PileType } from './game_initializer';

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
}
