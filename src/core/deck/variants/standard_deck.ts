import { Card, Suit, Rank, Color } from '../../card';
import { Deck } from '..';

export function createStandardDeck(): Deck {
  const cards: Card[] = [];
  const suits = Object.values(Suit) as Array<Suit>;
  const ranks = Object.values(Rank).filter(
    (value) => typeof value === 'number',
  ) as Array<Rank>;
  const redSuits = [Suit.Hearts, Suit.Diamonds];

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      const color = redSuits.includes(suit) ? Color.Red : Color.Black;
      cards.push(new Card(suit, rank, color));
    });
  });

  return new Deck(cards);
}
