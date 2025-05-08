import { PileType } from '../pile';

export interface drawFromStockConfig {
  destination: PileType;
  flipDrawnCards: boolean;
  numberOfCards: number;
  resetStockFromDestination: boolean;
}
