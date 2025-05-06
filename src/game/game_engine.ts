import { GamePlayError } from '../errors';
import { Game } from './game';
import { PileType } from './game_initializer';
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
    const { card, destination, origin } = move;
    const cardsToMove = origin.pile.splitAt(card);
    destination.pile.addPile(cardsToMove);
  }

  drawFromStock() {
    if (!this._rules.canDrawFromStock()) {
      throw new GamePlayError('Cannot draw from stock according to the rules.');
    }
    if (!this._rules.onDrawFromStock) {
      throw new GamePlayError(
        'onDrawFromStock must be defined if canDrawFromStock is true.',
      );
    }
    const {
      destination,
      flipDrawnCards,
      numberOfCards,
      resetStockFromDestination,
    } = this._rules.onDrawFromStock();
    const stock = this._game.getMutablePile('stock', 0);
    const destinationPiles = this._game.getMutablePiles(destination);

    if (destinationPiles.length > 1 && resetStockFromDestination) {
      throw new GamePlayError(
        'Cannot reset stock using multiple destination piles.',
      );
    }

    destinationPiles.forEach((pile) => {
      for (let i = 0; i < numberOfCards; i++) {
        if (stock.isEmpty) {
          if (resetStockFromDestination) {
            this.resetStock(destination, flipDrawnCards);
          } else throw new GamePlayError('Cannot draw from an empty stock.');
        }
        const card = stock.draw();
        if (flipDrawnCards) card.flip();
        pile.addCard(card);
      }
    });
  }

  private resetStock(sourceType: PileType, flipCards: boolean) {
    const stock = this._game.getMutablePile('stock', 0);
    const sourcePile = this._game.getMutablePile(sourceType, 0);
    if (sourcePile.isEmpty) {
      throw new GamePlayError(
        `Cannot reset stock from an empty ${sourceType} pile.`,
      );
    }
    while (!sourcePile.isEmpty) {
      const card = sourcePile.draw();
      if (flipCards) card.flip();
      stock.addCard(card);
    }
  }
}
