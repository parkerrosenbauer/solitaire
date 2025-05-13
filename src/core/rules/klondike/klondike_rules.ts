import { MoveRequest, PileReference } from '../../../dto';
import { GameRuleError } from '../../../errors';
import { Card, Rank } from '../../card';
import { Game } from '../../game';
import { Pile, PileType } from '../../pile';
import { DrawFromStockConfig } from '../draw_from_stock_config.interface';
import { GameRules } from '../game_rules';
import { GameType } from '../game_type.enum';
import * as RuleUtils from '../utils';
import * as Utils from '../../../utils';

export class KlondikeRules implements GameRules {
  gameType = GameType.Klondike;

  isValidMove(game: Game, move: MoveRequest): boolean {
    this._validateMoveRequest(move);
    const { destination } = move;
    switch (destination.type) {
      case PileType.Tableau:
        return this._canMoveToTableau(game, move);
      case PileType.Foundation:
        return this._canMoveToFoundation(game, move);
      default:
        throw new GameRuleError(`Cannot move card to ${destination.type}.`);
    }
  }

  isWinConditionMet(game: Game): boolean {
    for (let i = 0; i < game.getPiles(PileType.Foundation).length; i++) {
      if (game.getPile(PileType.Foundation, i).size !== 13) {
        return false;
      }
    }
    return (
      game.arePilesEmpty(PileType.Tableau) &&
      game.arePilesEmpty(PileType.Waste) &&
      game.arePilesEmpty(PileType.Stock)
    );
  }

  getAllValidMoves(game: Game): MoveRequest[] {
    const moves: MoveRequest[] = [];
    moves.push(...this.getValidMovesFromTableau(game));
    moves.push(...this.getValidMovesFromFoundation(game));
    moves.push(...this.getValidMovesFromWaste(game));
    if (moves.length > 0) return moves;
    return this.getValidMovesFromStock(game);
  }

  getValidMovesFromStock(game: Game, otherMoveCount: number): MoveRequest[] {
    const stock = game.getPile(PileType.Stock, 0);
    const waste = game.getPile(PileType.Waste, 0);

    // If both stock and waste are empty, drawing from stock is not possible
    if (stock.isEmpty && waste.isEmpty) return [];

    const move = [Utils.createDrawFromStockRequest(PileType.Waste)];
    // If there are other moves available, we don't need to check for possible
    // moves from stock or waste
    if (otherMoveCount > 0) return move;

    // Check the stock and waste piles for possible moves to tableau or foundation
    for (let i = 0; i < stock.size; i++) {
      if (this.getValidMovesFromWaste(game, i, PileType.Stock).length > 0) {
        return move;
      }
    }
    for (let j = 0; j < waste.size; j++) {
      if (this.getValidMovesFromWaste(game, j).length > 0) {
        return move;
      }
    }

    return [];
  }

  getValidMovesFromWaste(
    game: Game,
    cardIndex?: number,
    pileType: PileType = PileType.Waste,
  ): MoveRequest[] {
    // waste is not explicity typed to waste to be able to check
    // for moves with undrawn stock cards
    const waste = game.getPile(pileType, 0);

    // If the waste pile is empty, there is no valid move from waste
    if (waste.isEmpty) return [];

    const moves: MoveRequest[] = [];
    const topCardIndex = cardIndex ?? waste.size - 1;
    const topCard = waste.cards[topCardIndex];
    let moveRequest: MoveRequest;
    let destinationIndex: number;

    // Check for a valid move to foundation
    destinationIndex = this._validMoveToFoundationIndex(game, topCard);
    if (destinationIndex !== -1) {
      moveRequest = Utils.createWasteToFoundationRequest(
        topCardIndex,
        destinationIndex,
        0,
      );
      moves.push(moveRequest);
    }

    // Check for a valid move to tableau
    destinationIndex = this._validMoveToTableauIndex(game, topCardIndex, {
      type: PileType.Waste,
      index: 0,
    });
    if (destinationIndex !== -1) {
      moveRequest = Utils.createWasteToFoundationRequest(
        topCardIndex,
        destinationIndex,
        0,
      );
      moves.push(moveRequest);
    }
    return moves;
  }

  getValidMovesFromTableau(game: Game): MoveRequest[] {
    const tableau = game.getPiles(PileType.Tableau);
    const moves: MoveRequest[] = [];
    let destinationIndex = -1;
    let moveToTableau: MoveRequest;

    for (let i = 0; i < tableau.length; i++) {
      // Check for moves starting with the first face-up card
      const startIndex = RuleUtils.findFirstFaceUpCardIndex(tableau[i]);
      if (startIndex === -1) continue;
      for (let j = startIndex; j < tableau[i].size; j++) {
        // If the card is the top card, check for a move to foundation first
        const card = tableau[i].cards[j];
        if (RuleUtils.isTopCard(tableau[i], j)) {
          destinationIndex = this._validMoveToFoundationIndex(game, card);
          if (destinationIndex !== -1) {
            moves.push(
              Utils.createTableauToFoundationRequest(j, destinationIndex, i),
            );
            continue;
          }
        }
        // Check for a move to another tableau pile
        for (let k = 0; k < tableau.length; k++) {
          if (i === k) continue;
          moveToTableau = Utils.createTableauToTableauRequest(j, k, i);
          if (this._canMoveToTableau(game, moveToTableau)) {
            // If the card being checked is the first face up card, add the move
            if (j === startIndex) {
              moves.push(moveToTableau);
            } else {
              // If the card being checked is not the first face up card,
              // check if the previous card can be moved to foundation
              const previousCardIndex = j - 1;
              const previousCard = tableau[i].cards[previousCardIndex];
              destinationIndex = this._validMoveToFoundationIndex(
                game,
                previousCard,
              );
              // If the previous card cannot be moved to foundation,
              // then the move to tableau is not valid (would result in moving a card back and forth)
              // If the previous card can be moved to foundation, add both moves
              if (destinationIndex !== -1) {
                moves.push(
                  moveToTableau,
                  Utils.createTableauToFoundationRequest(
                    previousCardIndex,
                    destinationIndex,
                    i,
                  ),
                );
              }
            }
          }
        }
      }
    }
    return moves;
  }

  getValidMovesFromFoundation(game: Game): MoveRequest[] {
    const foundation = game.getPiles(PileType.Foundation);
    const tableau = game.getPiles(PileType.Tableau);

    // If the foundation pile is empty, there is no valid move from foundation
    if (game.arePilesEmpty(PileType.Foundation)) return [];

    const moves: MoveRequest[] = [];
    let destinationIndex: number;

    foundationLoop: for (let i = 0; i < foundation.length; i++) {
      // Skip empty foundation piles
      if (foundation[i].isEmpty) continue;
      // Only check for moves with the top card of the foundation pile
      const cardIndex = foundation[i].size - 1;
      destinationIndex = this._validMoveToTableauIndex(game, cardIndex, {
        type: PileType.Foundation,
        index: i,
      });
      // If a valid move to tableau is found, check if the top card of another
      // tableau pile can be placed on the card moving from foundation
      // otherwise there is no reason to move the card from foundation
      if (destinationIndex !== -1) {
        const card = foundation[i].cards[cardIndex];
        for (let j = 0; j < tableau.length; j++) {
          if (j === destinationIndex) continue;
          const firstFaceUpCardIndex = RuleUtils.findFirstFaceUpCardIndex(
            tableau[j],
          );
          const firstFaceUpCard = tableau[j].cards[firstFaceUpCardIndex];
          // If a valid move to the card from foundation is found, add both moves
          if (this._canPlaceCardOnCardTableau(firstFaceUpCard, card)) {
            moves.push(
              Utils.createFoundationToTableauRequest(
                cardIndex,
                destinationIndex,
                i,
              ),
              Utils.createTableauToTableauRequest(
                firstFaceUpCardIndex,
                destinationIndex,
                j,
              ),
            );
            continue foundationLoop;
          }
        }
      }
    }
    return moves;
  }

  hasAvailableMoves(game: Game): boolean {
    return this.getAllValidMoves(game).length > 0;
  }

  canDrawFromStock(): boolean {
    return true;
  }

  onDrawFromStock(): DrawFromStockConfig {
    return {
      destination: PileType.Waste,
      flipDrawnCards: true,
      numberOfCards: 1,
      resetStockFromDestination: true,
    };
  }

  private _canPlaceCardOnCardTableau(
    card: Card,
    destinationCard: Card,
  ): boolean {
    return (
      RuleUtils.isDifferentColor(destinationCard, card) &&
      RuleUtils.isNextLowerRank(destinationCard, card)
    );
  }

  private _canPlaceCardOnCardFoundation(
    card: Card,
    destinationCard: Card,
  ): boolean {
    return (
      RuleUtils.isSameSuit(destinationCard, card) &&
      RuleUtils.isNextHigherRank(destinationCard, card)
    );
  }

  private _canMoveToTableau(game: Game, move: MoveRequest): boolean {
    const { cardIndex, destination, origin } = move;
    const originPile = game.getPile(origin.type, origin.index);
    const destinationPile = game.getPile(destination.type, destination.index);
    const card = this._getValidCard(cardIndex, originPile, origin);
    if (!card.isFaceUp) {
      return false;
    } else if (
      !RuleUtils.isTopCard(originPile, cardIndex) &&
      origin.type !== 'tableau'
    ) {
      return false;
    } else if (destinationPile.isEmpty) {
      return card.rank === Rank.K;
    } else return this._canPlaceCardOnCardTableau(card, destinationPile.peek());
  }

  private _validMoveToTableauIndex(
    game: Game,
    cardIndex: number,
    origin: PileReference,
  ): number {
    const tableau = game.getPiles(PileType.Tableau);
    for (let i = 0; i < tableau.length; i++) {
      const moveToTableau = Utils.createOriginToTableauRequest(
        cardIndex,
        i,
        origin.type,
        origin.index,
      );
      if (this._canMoveToTableau(game, moveToTableau)) {
        return i;
      }
    }
    return -1;
  }

  private _canMoveToFoundation(game: Game, move: MoveRequest): boolean {
    const { cardIndex, destination, origin } = move;
    const originPile = game.getPile(origin.type, origin.index);
    const destinationPile = game.getPile(destination.type, destination.index);
    const card = this._getValidCard(cardIndex, originPile, origin);
    if (!card.isFaceUp || !RuleUtils.isTopCard(originPile, cardIndex)) {
      return false;
    } else if (destinationPile.isEmpty) {
      return card.rank === Rank.A;
    } else
      return this._canPlaceCardOnCardFoundation(card, destinationPile.peek());
  }

  private _validMoveToFoundationIndex(game: Game, card: Card): number {
    const foundation = game.getPiles(PileType.Foundation);
    for (let i = 0; i < foundation.length; i++) {
      if (foundation[i].isEmpty) {
        if (card.rank === Rank.A) return i;
        continue;
      }
      if (this._canPlaceCardOnCardFoundation(card, foundation[i].peek())) {
        return i;
      }
    }
    return -1;
  }

  private _validateMoveRequest(move: MoveRequest) {
    const { origin, destination } = move;
    if (
      origin.type === destination.type &&
      origin.index === destination.index
    ) {
      throw new GameRuleError(
        `Cannot move card to its origin pile: ${origin.type} ${origin.index}`,
      );
    }
  }

  private _getValidCard(
    cardIndex: number,
    pile: Pile,
    pileReference: PileReference,
  ): Card {
    if (pile.isEmpty) {
      throw new GameRuleError(
        `Cannot move card from empty pile: ${pileReference.type} ${pileReference.index}`,
      );
    }
    if (cardIndex < 0 || cardIndex >= pile.size) {
      throw new GameRuleError(
        `Invalid card index: ${cardIndex} for pile: ${pileReference.type} ${pileReference.index}`,
      );
    }
    return pile.cards[cardIndex];
  }
}
