import { PileType } from '../core/pile';
import { MoveRequest } from '../dto/move.request';

export function createDrawFromStockRequest(
  destinationType: PileType,
): MoveRequest {
  return {
    cardIndex: 0,
    destination: {
      type: destinationType,
      index: 0,
    },
    origin: {
      type: PileType.Stock,
      index: 0,
    },
  };
}

export function createOriginToTableauRequest(
  cardIndex: number,
  tableauIndex: number,
  originType: PileType,
  originIndex: number,
): MoveRequest {
  return {
    cardIndex,
    destination: {
      type: PileType.Tableau,
      index: tableauIndex,
    },
    origin: {
      type: originType,
      index: originIndex,
    },
  };
}

export function createWasteToTableauRequest(
  cardIndex: number,
  tableauIndex: number,
  wasteIndex: number,
): MoveRequest {
  return createOriginToTableauRequest(
    cardIndex,
    tableauIndex,
    PileType.Waste,
    wasteIndex,
  );
}

export function createTableauToTableauRequest(
  cardIndex: number,
  destinationIndex: number,
  originIndex: number,
): MoveRequest {
  return createOriginToTableauRequest(
    cardIndex,
    destinationIndex,
    PileType.Tableau,
    originIndex,
  );
}

export function createFoundationToTableauRequest(
  cardIndex: number,
  tableauIndex: number,
  foundationIndex: number,
): MoveRequest {
  return createOriginToTableauRequest(
    cardIndex,
    tableauIndex,
    PileType.Foundation,
    foundationIndex,
  );
}

export function createOriginToFoundationRequest(
  cardIndex: number,
  foundationIndex: number,
  originType: PileType,
  originIndex: number,
): MoveRequest {
  return {
    cardIndex,
    destination: {
      type: PileType.Foundation,
      index: foundationIndex,
    },
    origin: {
      type: originType,
      index: originIndex,
    },
  };
}

export function createWasteToFoundationRequest(
  cardIndex: number,
  foundationIndex: number,
  wasteIndex: number,
): MoveRequest {
  return createOriginToFoundationRequest(
    cardIndex,
    foundationIndex,
    PileType.Waste,
    wasteIndex,
  );
}

export function createTableauToFoundationRequest(
  cardIndex: number,
  foundationIndex: number,
  tableauIndex: number,
): MoveRequest {
  return createOriginToFoundationRequest(
    cardIndex,
    foundationIndex,
    PileType.Tableau,
    tableauIndex,
  );
}
