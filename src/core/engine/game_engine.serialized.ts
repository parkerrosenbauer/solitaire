import { SerializedGame } from '../game/game.serialized';
import { GameType } from '../rules/game_type.enum';

export type SerializedGameEngine = {
  gameType: GameType;
  game: SerializedGame;
};
