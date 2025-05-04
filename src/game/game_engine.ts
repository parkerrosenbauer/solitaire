import { GamePlayError } from '../errors';
import { Game } from './game';

export class GameEngine {
  private _game: Game;

  constructor(game: Game) {
    this._game = game;
  }

  drawFromStock() {
    const stock = this._game.getMutablePile('stock', 0);
    const waste = this._game.getMutablePile('waste', 0);
    if (stock.isEmpty && waste.isEmpty) {
      throw new GamePlayError('Cannot draw from an empty stock and waste.');
    }
    if (stock.isEmpty) {
      this.resetStock();
    }
    const card = stock.draw();
    card.flip();
    waste.addCard(card);
  }

  private resetStock() {
    const stock = this._game.getMutablePile('stock', 0);
    const waste = this._game.getMutablePile('waste', 0);
    while (!waste.isEmpty) {
      const card = waste.draw();
      card.flip();
      stock.addCard(card);
    }
  }
}
