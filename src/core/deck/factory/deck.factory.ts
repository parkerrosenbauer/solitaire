import { Deck } from '../deck';
import { DeckVariant } from '../deck_variant.enum';
import { createDoubleDeck } from '../variants/double_deck';
import { createStandardDeck } from '../variants/standard_deck';

export function createDeck(variant: DeckVariant): Deck {
  switch (variant) {
    case DeckVariant.Standard:
      return createStandardDeck();
    case DeckVariant.Double:
      return createDoubleDeck();
    default:
      throw new Error(`Unsupported deck variant: ${variant}`);
  }
}
