import { Path } from "./Path";
import { Piece } from "./Piece";
import { Player } from "./Player";
import { Position } from "./Position";

interface MoveInterface {
  player: Player;
  piece: Piece;
  position: Position;
  path: Path;
}

export class Move {
  player: Player;
  piece: Piece;
  position: Position;
  path: Path;

  constructor({ player, piece, position, path }: MoveInterface) {
    this.player = player;
    this.piece = piece;
    this.position = position;
    this.path = path;
  }
}
