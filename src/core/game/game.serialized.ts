import { SerializedPile } from '../pile/pile.serialized';

export type SerializedGame = {
  stock: SerializedPile[];
  waste: SerializedPile[];
  tableau: SerializedPile[];
  foundation: SerializedPile[];
};
