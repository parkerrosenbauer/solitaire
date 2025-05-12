import { KlondikeRules } from '../klondike/klondike_rules';
import { GameRules } from '../game_rules';
import { GameType } from '../game_type.enum';
import { FreeCellRules } from '../free_cell/free_cell_rules';
import { SpiderRules } from '../spider/spider_rules';

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
