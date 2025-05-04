import { FreeCellRules } from './free_cell_rules';
import { GameRules } from './game_rules';
import { SolitaireRules } from './solitaire_rules';
import { SpiderRules } from './spider_rules';

export enum GameType {
  Solitaire = 'solitaire',
  FreeCell = 'freecell',
  Spider = 'spider',
}

export function createGameRules(type: GameType): GameRules {
  switch (type) {
    case GameType.Solitaire:
      return new SolitaireRules();
    case GameType.FreeCell:
      return new FreeCellRules();
    case GameType.Spider:
      return new SpiderRules();
    default:
      throw new Error(`Unsupported game type: ${type}`);
  }
}
