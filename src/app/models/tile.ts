import { TileStatus } from './tile-status';

export interface Tile {
  id: number;
  image: string;
  status: TileStatus;
}
