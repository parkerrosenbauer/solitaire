import { GameError } from '../errors';
import { Card } from '../models';
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

  arePilesEmpty(type: PileType): boolean {
    for (let pile of this._piles[type]) {
      if (!pile.isEmpty) return false;
    }
    return true;
  }

  isTopCard(card: Card, type: PileType, index: number): boolean {
    const pile = this.getPile(type, index);
    return card === pile.peek;
  }
}
