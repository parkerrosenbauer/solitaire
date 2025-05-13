import { SerializedGame } from '../game/game.serialized';
import { GameType } from '../rules/game_type.enum';

export type SerializedGameSession = {
  gameType: GameType;
  game: SerializedGame;
};
