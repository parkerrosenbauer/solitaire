import { MoveRequest } from "../../../../dto";
import { Game } from "../../../game";
import { PileType } from "../../../pile";
import * as Utils from "../../../../utils";
import * as RuleUtils from "../../utils";
import * as KlondikeUtils from "./move_validators";

/**
 * Checks if drawing from the stock pile will yeild a valid move.
 * Logic:
 * - If both stock and waste are empty, return an empty array
 * - If stock is not empty, check if a card in the pile can be moved to tableau or foundation
 * - If not, and waste is not empty, check if a card in the waste pile can be moved to tableau or foundation
 * - If a valid move is found, return a draw request move
 *
 * @param game the game instance
 * @returns MoveRequest[] - an array of valid moves from stock
 */
export function getValidMovesFromStock(game: Game): MoveRequest[] {
  const stock = game.getPile(PileType.Stock, 0);
  const waste = game.getPile(PileType.Waste, 0);

  if (stock.isEmpty && waste.isEmpty) return [];

  const move = [Utils.createDrawFromStockRequest(PileType.Waste)];

  for (let i = 0; i < stock.size; i++) {
    if (getValidMovesFromWaste(game, i, PileType.Stock).length > 0) {
      return move;
    }
  }
  for (let j = 0; j < waste.size; j++) {
    if (getValidMovesFromWaste(game, j).length > 0) {
      return move;
    }
  }

  return [];
}

/**
 * Checks if a card can be moved from tableau or foundation when it is the top waste card.
 * The card to check can be dynamically specified to simulate it being the top waste card.
 * Logic:
 *  - If the waste pile is empty, return an empty array
 *  - Check if the card can be moved to foundation
 *  - If not, check if the card can be moved to tableau
 *
 * @param game the game instance
 * @param cardIndex index of the card in origin pile
 * @param pileType type of the pile to check for valid moves
 * @returns MoveRequest[] - an array of valid moves from waste
 */
export function getValidMovesFromWaste(
  game: Game,
  cardIndex?: number,
  pileType: PileType = PileType.Waste
): MoveRequest[] {
  const waste = game.getPile(pileType, 0);

  if (waste.isEmpty) return [];

  const topCardIndex = cardIndex ?? waste.size - 1;
  const topCard = waste.cards[topCardIndex];
  let moveRequest: MoveRequest;
  let destinationIndex: number;

  destinationIndex = KlondikeUtils.validMoveToFoundationIndex(game, topCard);
  if (destinationIndex !== -1) {
    moveRequest = Utils.createWasteToFoundationRequest(
      topCardIndex,
      destinationIndex,
      0
    );
    return [moveRequest];
  }

  destinationIndex = KlondikeUtils.validMoveToTableauIndex(game, topCardIndex, {
    type: PileType.Waste,
    index: 0,
  });
  if (destinationIndex !== -1) {
    moveRequest = Utils.createWasteToTableauRequest(
      topCardIndex,
      destinationIndex,
      0
    );
    return [moveRequest];
  }
  return [];
}

/**
 * Checks if a card can be moved from tableau to foundation or tableau.
 * Logic:
 * - Get all tableau piles
 * - For each tableau pile, check for moves starting with the first face up card
 * - If that card is the top card, check for a move to foundation first
 * - If not, check for a move to another tableau pile
 * - If the card is the first face up card, add the move to the array and continue
 * - If not, check if the previous card can be moved to foundation
 * - If the previous card can be moved to foundation, add both moves to the moves array
 *
 * @param game the game instance
 * @returns MoveRequest[] - an array of valid moves from tableau
 */
export function getValidMovesFromTableau(game: Game): MoveRequest[] {
  const tableau = game.getPiles(PileType.Tableau);
  const moves: MoveRequest[] = [];
  let destinationIndex = -1;
  let moveToTableau: MoveRequest;

  for (let i = 0; i < tableau.length; i++) {
    const startIndex = RuleUtils.findFirstFaceUpCardIndex(tableau[i]);
    if (startIndex === -1) continue;
    for (let j = startIndex; j < tableau[i].size; j++) {
      const card = tableau[i].cards[j];
      if (RuleUtils.isTopCard(tableau[i], j)) {
        destinationIndex = KlondikeUtils.validMoveToFoundationIndex(game, card);
        if (destinationIndex !== -1) {
          moves.push(
            Utils.createTableauToFoundationRequest(j, destinationIndex, i)
          );
          continue;
        }
      }
      for (let k = 0; k < tableau.length; k++) {
        if (i === k) continue;
        moveToTableau = Utils.createTableauToTableauRequest(j, k, i);
        if (KlondikeUtils.canMoveToTableau(game, moveToTableau)) {
          if (j === startIndex) {
            const { destination } = moveToTableau;
            if (
              j !== 0 ||
              !game.getPile(destination.type, destination.index).isEmpty
            ) {
              moves.push(moveToTableau);
            } else {
              // if card is first in pile and can move to an empty tableau, do not add move
              continue;
            }
          } else {
            const previousCardIndex = j - 1;
            const previousCard = tableau[i].cards[previousCardIndex];
            destinationIndex = KlondikeUtils.validMoveToFoundationIndex(
              game,
              previousCard
            );
            if (destinationIndex !== -1) {
              moves.push(
                moveToTableau,
                Utils.createTableauToFoundationRequest(
                  previousCardIndex,
                  destinationIndex,
                  i
                )
              );
            }
          }
        }
      }
    }
  }
  return moves;
}

/**
 * Checks if a card can be moved from foundation to tableau.
 * Logic:
 * - Get all foundation piles
 * - For each foundation pile, check if the top card can be moved to tableau
 * - If a valid move to tableau is found, check the first face up card of all other tableaus
 * - If a valid move of that card to the foundaiton card is found, add both moves to the moves array
 * - Otherwise, do not add the move from foundation to tableau
 *
 * @param game the game instance
 * @returns MoveRequest[] - an array of valid moves from foundation
 */
export function getValidMovesFromFoundation(game: Game): MoveRequest[] {
  const foundation = game.getPiles(PileType.Foundation);
  const tableau = game.getPiles(PileType.Tableau);

  if (game.arePilesEmpty(PileType.Foundation)) return [];

  const moves: MoveRequest[] = [];
  let destinationIndex: number;

  foundationLoop: for (let i = 0; i < foundation.length; i++) {
    if (foundation[i].isEmpty) continue;
    const cardIndex = foundation[i].size - 1;
    destinationIndex = KlondikeUtils.validMoveToTableauIndex(game, cardIndex, {
      type: PileType.Foundation,
      index: i,
    });
    if (destinationIndex !== -1) {
      const card = foundation[i].cards[cardIndex];
      for (let j = 0; j < tableau.length; j++) {
        if (j === destinationIndex) continue;
        const firstFaceUpCardIndex = RuleUtils.findFirstFaceUpCardIndex(
          tableau[j]
        );
        const firstFaceUpCard = tableau[j].cards[firstFaceUpCardIndex];
        if (KlondikeUtils.canPlaceCardOnCardTableau(firstFaceUpCard, card)) {
          moves.push(
            Utils.createFoundationToTableauRequest(
              cardIndex,
              destinationIndex,
              i
            ),
            Utils.createTableauToTableauRequest(
              firstFaceUpCardIndex,
              destinationIndex,
              j
            )
          );
          continue foundationLoop;
        }
      }
    }
  }
  return moves;
}
