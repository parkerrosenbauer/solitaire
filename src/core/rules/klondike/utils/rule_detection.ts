import { MoveRequest } from '../../../../dto';
import { Game } from '../../../game';
import { PileType } from '../../../pile';
import * as Utils from '../../../../utils';
import * as RuleUtils from '../../utils';
import * as KlondikeUtils from './move_validator';

export function getValidMovesFromStock(game: Game): MoveRequest[] {
  const stock = game.getPile(PileType.Stock, 0);
  const waste = game.getPile(PileType.Waste, 0);

  // If both stock and waste are empty, drawing from stock is not possible
  if (stock.isEmpty && waste.isEmpty) return [];

  const move = [Utils.createDrawFromStockRequest(PileType.Waste)];

  // Check the stock and waste piles for possible moves to tableau or foundation
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

export function getValidMovesFromWaste(
  game: Game,
  cardIndex?: number,
  pileType: PileType = PileType.Waste,
): MoveRequest[] {
  // waste is not explicity typed to waste to be able to check
  // for moves with undrawn stock cards
  const waste = game.getPile(pileType, 0);

  // If the waste pile is empty, there is no valid move from waste
  if (waste.isEmpty) return [];

  const topCardIndex = cardIndex ?? waste.size - 1;
  const topCard = waste.cards[topCardIndex];
  let moveRequest: MoveRequest;
  let destinationIndex: number;

  // Check for a valid move to foundation
  destinationIndex = KlondikeUtils.validMoveToFoundationIndex(game, topCard);
  if (destinationIndex !== -1) {
    moveRequest = Utils.createWasteToFoundationRequest(
      topCardIndex,
      destinationIndex,
      0,
    );
    return [moveRequest];
  }

  // Check for a valid move to tableau
  destinationIndex = KlondikeUtils.validMoveToTableauIndex(game, topCardIndex, {
    type: PileType.Waste,
    index: 0,
  });
  if (destinationIndex !== -1) {
    moveRequest = Utils.createWasteToTableauRequest(
      topCardIndex,
      destinationIndex,
      0,
    );
    return [moveRequest];
  }
  return [];
}

export function getValidMovesFromTableau(game: Game): MoveRequest[] {
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
        destinationIndex = KlondikeUtils.validMoveToFoundationIndex(game, card);
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
        if (KlondikeUtils.canMoveToTableau(game, moveToTableau)) {
          // If the card being checked is the first face up card, add the move
          if (j === startIndex) {
            moves.push(moveToTableau);
          } else {
            // If the card being checked is not the first face up card,
            // check if the previous card can be moved to foundation
            const previousCardIndex = j - 1;
            const previousCard = tableau[i].cards[previousCardIndex];
            destinationIndex = KlondikeUtils.validMoveToFoundationIndex(
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

export function getValidMovesFromFoundation(game: Game): MoveRequest[] {
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
    destinationIndex = KlondikeUtils.validMoveToTableauIndex(game, cardIndex, {
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
        if (KlondikeUtils.canPlaceCardOnCardTableau(firstFaceUpCard, card)) {
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
