import { createFreeCellConfig } from '../game_configs/free_cell_config';
import { GameConfig } from '../game_config.interface';
import { createKlondikeConfig } from '../game_configs/klondike_config';
import { createSpiderConfig } from '../game_configs/spider_config';
import { GameType } from '../../rules';

export function createGameConfig(type: GameType): GameConfig {
  switch (type) {
    case GameType.Klondike:
      return createKlondikeConfig();
    case GameType.FreeCell:
      return createFreeCellConfig();
    case GameType.Spider:
      return createSpiderConfig();
    default:
      throw new Error(`Unsupported game type: ${type}`);
  }
}
