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

/**
 * Class that wraps the state of a move taken by a player.
 *
 * @property {Player} player The player that makes the move
 * @property {Piece} piece The piece moved
 * @property {Position} position The target position
 * @property {Path} path The path taken by the piece
 */
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
