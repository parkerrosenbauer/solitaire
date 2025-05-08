import { Card, Color, Rank, Suit } from '../../core/card';

export type SerializedCard = {
  suit: Suit;
  rank: Rank;
  color: Color;
  faceUp: boolean;
};

export function serializeCard(card: Card): SerializedCard {
  return {
    suit: card.suit,
    rank: card.rank,
    color: card.color,
    faceUp: card.isFaceUp,
  };
}
