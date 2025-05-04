import { GamePlayError } from '../errors';
import { Game } from './game';
import { GameRules, MoveDto } from './rules/game_rules';

export class GameEngine {
  constructor(
    private readonly _game: Game,
    private readonly _rules: GameRules,
  ) {}

  moveCard(move: MoveDto) {
    if (!this._rules.isValidMove(move)) {
      throw new GamePlayError('Invalid move according to the rules.');
    }
    const { card, destination } = move;
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
