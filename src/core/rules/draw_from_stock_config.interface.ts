import { PileType } from '../pile';

export interface DrawFromStockConfig {
  destination: PileType;
  flipDrawnCards: boolean;
  numberOfCards: number;
  resetStockFromDestination: boolean;
}
