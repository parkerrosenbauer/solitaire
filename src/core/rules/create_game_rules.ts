import { FreeCellRules } from './free_cell_rules';
import { GameRules } from './game_rules';
import { GameType } from './game_type.enum';
import { KlondikeRules } from './klondike_rules';
import { SpiderRules } from './spider_rules';

export function createGameRules(type: GameType): GameRules {
  switch (type) {
    case GameType.Klondike:
      return new KlondikeRules();
    case GameType.FreeCell:
      return new FreeCellRules();
    case GameType.Spider:
      return new SpiderRules();
    default:
      throw new Error(`Unsupported game type: ${type}`);
  }
}
