import { Card, Color, Rank, Suit } from '../core/card';
import { Pile } from '../core/pile/pile';
import { Game } from '../core/game';

export interface MockGameConfig {
  stock?: Pile[];
  waste?: Pile[];
  tableau?: Pile[];
  foundation?: Pile[];
}

export function cardOf(rank: Rank, suit: Suit, faceUp: boolean = false) {
  const redSuits = [Suit.Diamonds, Suit.Hearts];
  const card = new Card(
    suit,
    rank,
    redSuits.includes(suit) ? Color.Red : Color.Black,
  );
  if (faceUp) card.flip();
  return card;
}

export function pileOf(...cards: Card[]) {
  return new Pile(cards);
}

export function mockGame(mockGameConfig: MockGameConfig) {
  return new Game({
    stock: mockGameConfig.stock || [pileOf()],
    waste: mockGameConfig.waste || [pileOf()],
    tableau: mockGameConfig.tableau || [pileOf()],
    foundation: mockGameConfig.foundation || [pileOf()],
  });
}
