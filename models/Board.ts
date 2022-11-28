import { nypink, russianviolet, selectiveyellow } from "../utils/colors";
import { Piece } from "./Piece";
import { Position } from "./Position";

interface BoardInterface {
  pieces: Array<Piece>;
  enabled?: boolean;
}

export class Board {
  pieces: Array<Piece>;
  selected: Piece | null;
  enabled: boolean;

  constructor({ pieces, enabled = true }: BoardInterface) {
    this.pieces = pieces;
    this.enabled = enabled;
    this.selected = null;
  }

  get layout() {
    let grid: Array<Array<Piece | undefined>> = Array(
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    );
    this.pieces.map((piece) => {
      grid[piece.position.y][piece.position.x] = piece;
    });
    return grid;
  }

  /**
   * Checks if a Piece is present at the specified Position
   * @param position
   * @returns boolean True if
   */
  hasPiece(position: Position): boolean {
    if (this.layout[position.y][position.x] != undefined) {
      return true;
    }
    return false;
  }

  possibleMoves(piece: Piece): Array<Position> {
    throw Error;
  }

  /**
   * Generates an initial checkers board layout
   * @returns Board
   */
  static startBoard(): Board {
    let pieceIndex = 0;
    // Loop through an 8x8 bidimensional array
    let pieces: Array<Piece> = Array(24);
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (y < 3 && Position.isValidPosition(x, y)) {
          // Draw black pieces
          pieceIndex += 1;
          pieces.push(new Piece(pieceIndex, nypink, new Position(x, y)));
        } else if (y > 4 && Position.isValidPosition(x, y)) {
          // Draw white pieces
          pieceIndex += 1;
          pieces.push(
            new Piece(pieceIndex, selectiveyellow, new Position(x, y))
          );
        }
      }
    }
    return new Board({ pieces, enabled: true });
  }

  /**
   * Generates a disabled random checkers board layout
   * @returns Board
   */
  static randomBoard(): Board {
    let pieces: Array<Piece> = Array();
    let min = 8;
    let blackPieces = Array(Math.floor(Math.random() * (12 - min + 1) + min));
    let whitePieces = Array(Math.floor(Math.random() * (12 - min + 1) + min));

    let grid: Array<Array<Piece | undefined>> = Array(
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    );

    let black = 0;
    for (
      let index = 0;
      index < blackPieces.length + whitePieces.length;
      index++
    ) {
      var found = false;
      while (found == false) {
        let x = Math.floor(Math.random() * 8);
        let y = Math.floor(Math.random() * 8);

        if (Position.isValidPosition(x, y) && grid[y][x] == undefined) {
          found = true;
          let color: string;
          if (black < blackPieces.length) {
            color = selectiveyellow;
            black += 1;
          } else {
            color = nypink;
          }
          let piece = new Piece(index, color, new Position(x, y));
          grid[y][x] = piece;
          pieces.push(piece);
        }
      }
    }

    return new Board({ pieces: pieces, enabled: false });
  }
}
