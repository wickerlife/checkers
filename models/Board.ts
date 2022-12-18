import { nypink, russianviolet, selectiveyellow } from "../utils/colors";
import { Path } from "./Path";
import { Piece } from "./Piece";
import { Player } from "./Player";
import { Direction, Position } from "./Position";

interface BoardInterface {
  pieces: Array<Piece>;
  paths?: Array<Path>;
  enabled?: boolean;
}

export class Board {
  pieces: Array<Piece>;
  selected: Piece | null;
  enabled: boolean;
  paths: Array<Path>;

  constructor({ pieces, enabled = true, paths = [] }: BoardInterface) {
    this.pieces = pieces;
    this.enabled = enabled;
    this.selected = null;
    this.paths = paths;
  }

  /**
   * Returns a layout version of the board
   * @param board
   * @returns Array
   */
  static layout(board: Board): (Piece | undefined)[][] {
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
    board.pieces.map((piece) => {
      grid[piece.position.y][piece.position.x] = piece;
    });

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        let ppiece = board.pieces.filter(
          (piece) => piece.position.y == y && piece.position.x == x
        );
        if (ppiece != null) {
          grid[y][x] = ppiece[0];
        } else {
          grid[y][x] = undefined;
        }
      }
    }
    return grid;
  }

  /**
   * Checks if a Piece is present at the specified Position
   * @param board
   * @param position
   * @returns boolean
   */
  static hasPiece(board: Board, position: Position): boolean {
    if (
      board.pieces.find(
        (piece) =>
          piece != undefined &&
          piece.position.x == position.x &&
          piece.position.y == position.y
      ) != undefined
    ) {
      return true;
    }
    return false;
  }

  /**
   * Returns a piece at a specific position
   * @param board
   * @param position
   * @returns Piece
   */
  static getPiece(board: Board, position: Position): Piece | undefined {
    return board.pieces.find(
      (piece) =>
        piece != undefined &&
        piece.position.x == position.x &&
        piece.position.y == position.y
    );
  }

  /**
   * Returns all possible moves a piece can make
   * @param piece
   * @param board
   * @returns Array<Path>
   */
  static possiblePaths(board: Board, piece: Piece): Array<Path> {
    let possible = new Array<Position>();

    let directions = [];

    if (!piece.isdama) {
      if (piece.player.id == 1) {
        directions.push(Direction.TopLeft, Direction.TopRight);
      } else {
        directions.push(Direction.BottomRight, Direction.BottomLeft);
      }
    } else {
      directions.push(
        Direction.TopLeft,
        Direction.TopRight,
        Direction.BottomRight,
        Direction.BottomLeft
      );
    }

    // Recursive search function
    const search = (
      position: Position,
      directions: Array<Direction>,
      steps: Array<Position> = []
    ) => {
      let paths = [] as Array<Path>;
      steps.push(position);

      directions.forEach((direction) => {
        let newpos = position.getNeighbour(direction);

        if (newpos != undefined) {
          if (Board.hasPiece(board, newpos)) {
            let nextpos = newpos.getNeighbour(direction);
            if (nextpos != undefined) {
              if (Board.hasPiece(board, nextpos)) {
                if (steps.length > 1) paths.push(new Path({ steps: steps }));
                // stop
              } else {
                let tpaths = search(nextpos, directions, steps);
                console.log("RECURSIVE PATHS: ", tpaths);
                paths.push(...tpaths);
                // recursion
                //let paths = search(nextpos, directions, steps);
                //tpaths.push(...paths);
              }
            } else {
              if (!Board.hasPiece(board, newpos))
                paths.push(new Path({ steps: [...steps, newpos] }));
            }
          } else {
            if (steps.at(0) == position)
              paths.push(new Path({ steps: [...steps, newpos] }));
          }
        }
      });

      return paths;
    };

    let paths = search(piece.position, directions).sort(
      (a, b) => a.getEaten(board).length - b.getEaten(board).length
    );
    console.log("UNFILTERED PATHS ", paths);

    let filtered = paths.filter(
      (path, index) =>
        path.getEaten(board).length == paths[0].getEaten(board).length &&
        path.getSteps() > 1
    );
    return filtered;
  }

  /**
   * Generates an initial checkers board layout
   * @returns Board
   */
  static startBoard(players: Array<Player>): Board {
    let pieceIndex = 0;
    // Loop through an 8x8 bidimensional array
    let pieces: Array<Piece> = Array(24);
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (y < 3 && Position.isValidPosition(x, y)) {
          // Draw black pieces
          pieceIndex += 1;
          pieces.push(
            new Piece({
              id: pieceIndex,
              player: players[1],
              position: new Position(x, y),
            })
          );
        } else if (y > 4 && Position.isValidPosition(x, y)) {
          // Draw white pieces
          pieceIndex += 1;
          pieces.push(
            new Piece({
              id: pieceIndex,
              player: players[0],
              position: new Position(x, y),
            })
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
      let player1 = new Player({
        id: 1,
        username: "Player1",
        color: selectiveyellow,
      });
      let player2 = new Player({
        id: 2,
        username: "Player2",
        color: nypink,
      });
      while (found == false) {
        let x = Math.floor(Math.random() * 8);
        let y = Math.floor(Math.random() * 8);

        if (Position.isValidPosition(x, y) && grid[y][x] == undefined) {
          found = true;
          let tempplayer: Player;
          if (black < blackPieces.length) {
            tempplayer = player1;
            black += 1;
          } else {
            tempplayer = player2;
          }
          let piece = new Piece({
            id: index,
            player: tempplayer,
            position: new Position(x, y),
          });
          grid[y][x] = piece;
          pieces.push(piece);
        }
      }
    }

    return new Board({ pieces: pieces, enabled: false }); //  TODO enabled set to false
  }
}
