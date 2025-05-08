import { Card } from '../core/card';
import { PileDto } from './pile.dto';

export interface MoveDto {
  card: Card;
  destination: PileDto;
  origin: PileDto;
}
