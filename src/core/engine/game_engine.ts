import { GamePlayError } from '../../errors';
import { Game } from '../game/game';
import { PileType } from '../pile';
import { createGameRules, GameRules } from '../rules';
import { MoveDto } from '../../dto';
import { SerializedGameEngine } from './game_engine.serialized';
import { Card } from '../card';

export class GameEngine {
  constructor(
    private readonly _game: Game,
    private readonly _rules: GameRules,
  ) {}

  moveCard(move: MoveDto) {
    if (!this._rules.isValidMove(this._game, move)) {
      throw new GamePlayError('Invalid move according to the rules.');
    }
    const { serializedCard, destination, origin } = move;
    const card = Card.deserialize(serializedCard);
    const cardsToMove = this._game
      .getMutablePile(origin.type, origin.index)
      .splitAt(card);
    this._game
      .getMutablePile(destination.type, destination.index)
      .addPile(cardsToMove);
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

  isWinConditionMet(): boolean {
    return this._rules.isWinConditionMet(this._game);
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

  serialize(): SerializedGameEngine {
    return {
      game: this._game.serialize(),
      gameType: this._rules.gameType,
    };
  }

  static deserialize(serialized: SerializedGameEngine): GameEngine {
    const game = Game.deserialize(serialized.game);
    const rules = createGameRules(serialized.gameType);
    return new GameEngine(game, rules);
  }
}
