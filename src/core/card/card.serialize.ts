import { Color, Rank, Suit } from '.';

export type SerializedCard = {
  suit: Suit;
  rank: Rank;
  color: Color;
  faceUp: boolean;
};
