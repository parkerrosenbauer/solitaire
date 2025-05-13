import { GamePlayError } from '../../errors';
import { Game } from '../game/game';
import { PileType } from '../pile';
import { MoveRequest } from '../../dto';
import { DrawFromStockConfig } from '../rules/draw_from_stock_config.interface';

export class GameEngine {
  constructor(private readonly _game: Game) {}

  moveCard(move: MoveRequest) {
    const { cardIndex, destination, origin } = move;
    const cardsToMove = this._game
      .getMutablePile(origin.type, origin.index)
      .splitAt(cardIndex);
    this._game
      .getMutablePile(destination.type, destination.index)
      .addPile(cardsToMove);
  }

  drawFromStock(drawFromStockConfig: DrawFromStockConfig) {
    const {
      destination,
      flipDrawnCards,
      numberOfCards,
      resetStockFromDestination,
    } = drawFromStockConfig;
    const stock = this._game.getMutablePile(PileType.Stock, 0);
    const destinationPiles = this._game.getMutablePiles(destination);

    if (destinationPiles.length > 1 && resetStockFromDestination) {
      throw new GamePlayError(
        'Cannot reset stock using multiple destination piles.',
      );
    }

    for (let i = 0; i < numberOfCards; i++) {
      destinationPiles.forEach((pile) => {
        if (stock.isEmpty) {
          if (resetStockFromDestination) {
            this._resetStock(destination, flipDrawnCards);
          } else throw new GamePlayError('Cannot draw from an empty stock.');
        }
        const card = stock.draw();
        if (flipDrawnCards) card.flip();
        pile.addCard(card);
      });
    }
  }

  private _resetStock(sourceType: PileType, flipCards: boolean) {
    const stock = this._game.getMutablePile(PileType.Stock, 0);
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
