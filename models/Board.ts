import { nypink, selectiveyellow } from "../utils/colors";
import { Path } from "./Path";
import { Piece } from "./Piece";
import { Player } from "./Player";
import { Direction, Position } from "./Position";

interface BoardInterface {
  pieces: Array<Piece>;
  paths?: Array<Path>;
  enabled?: boolean;
  mandatoryPaths?: Array<Path>;
}

export class Board {
  pieces: Array<Piece>;
  selected: Piece | null;
  enabled: boolean;
  paths: Array<Path>;
  mandatoryPaths: Array<Path>;

  constructor({
    pieces,
    enabled = true,
    paths = [],
    mandatoryPaths = [],
  }: BoardInterface) {
    this.pieces = pieces;
    this.enabled = enabled;
    this.selected = null;
    this.paths = paths;
    this.mandatoryPaths = mandatoryPaths;
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
   * Returns all pieces still present of a select player
   * @param piece
   * @param board
   * @returns Array<Path>
   */
  static getPlayerPieces(board: Board, player: Player): Array<Piece> {
    return board.pieces.filter((piece) => piece.player.id == player.id);
  }

  /**
   * Returns all possible moves a piece can make
   * @param piece
   * @param board
   * @returns Array<Path>
   */
  static possiblePaths(board: Board, piece: Piece): Array<Path> {
    let possible = new Array<Path>();

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

    interface searchInterface {
      position: Position;
      directions: Array<Direction>;
      steps?: Array<Position>;
      paths?: Array<Path>;
      eaten?: number;
    }

    /**
     * Recursive function
     * Returns all possible paths a piece can take
     *
     * @param param0
     * @returns
     */
    const search = ({
      position,
      directions,
      steps = [],
      paths = [],
      eaten = 0,
    }: searchInterface) => {
      steps.push(position);

      directions.forEach((direction) => {
        let index = steps.length - 1;
        let newpos = position.getNeighbour(direction);

        if (newpos == undefined) {
          // Condition 5: at edge
          if (steps.length > 1) {
            let np = new Path({ steps: [...steps] });
            if (!np.isincluded(paths)) paths.push(np);
          }
        } else {
          // Conditions 2, 3 or 4 (has enemy neighbour)
          let haspiece = Board.hasPiece(board, newpos);
          let isfriend =
            Board.getPiece(board, newpos)?.player.id == piece.player.id;
          if (haspiece && !isfriend) {
            let nextpos = newpos.getNeighbour(direction);

            if (nextpos == undefined) {
              // Condition 4: Has neighbour at edge
              if (steps.length > 1) {
                let np = new Path({ steps: [...steps] });
                if (!np.isincluded(paths)) paths.push(np);
              }
            } else {
              if (Board.hasPiece(board, nextpos)) {
                // Condition 2: Has neighbour next to neighbour
                let np = new Path({ steps: [...steps] });
                if (!np.isincluded(paths)) paths.push(np);
              } else {
                // Condition 3: Has void next to neighbour (RECURSION POINT)
                /**
                 * Remove incoming direction from list
                 * Otherwise if the piece is a Dama, the loop will be endless
                 */
                let filteredDirections = directions.filter(
                  (dir) => Position.getOppositeDirection(dir) != direction
                );
                let newpaths = search({
                  position: nextpos,
                  directions: filteredDirections,
                  steps: [...steps],
                  paths: [...paths],
                  eaten: eaten,
                });
                for (const npath of newpaths) {
                  if (!npath.isincluded(paths)) {
                    paths.push(npath);
                  }
                }
              }
            }
          } else {
            // Has no neighbour or neighbour is friend
            if (Board.getPiece(board, newpos)?.player.id != piece.player.id) {
              // Has no neighbour
              if (steps.length > 1) {
                // Condition 1.b (has no neighbour and is following move)
                if (steps.length > 1) {
                  let np = new Path({ steps: [...steps] });
                  if (!np.isincluded(paths)) paths.push(np);
                }
              } else {
                // Condition 1.a (has no neighbour and is first move)
                let np = new Path({ steps: [...steps, newpos] });
                if (!np.isincluded(paths)) paths.push(np);
              }
            }
          }
        }
      });
      return paths;
    };

    let paths = search({
      position: piece.position,
      directions: directions,
    }).sort((a, b) => b.getEaten(board).length - a.getEaten(board).length);

    let filtered = paths.filter(
      (path, index) =>
        path.getEaten(board).length == paths[0].getEaten(board).length &&
        path.getSteps() > 1
    );

    return filtered;
  }

  /**
   * Returns the mandatory path if present
   * @param piece
   * @param board
   * @returns Array<Path>
   */
  static mandatoryPaths(board: Board, turn: Player): Array<Path> {
    let playerPieces = Board.getPlayerPieces(board, turn);
    let allPaths = [] as Array<Path>;

    // Get all paths where at least a piece is eaten
    playerPieces.forEach((piece) => {
      let paths = Board.possiblePaths(board, piece);
      paths.forEach((path) => {
        if (path.getEaten(board).length > 0) allPaths.push(path);
      });
    });
    allPaths.sort(
      (a, b) => b.getEaten(board).length - a.getEaten(board).length
    );

    // Filter paths and only get the one with most eaten pieces
    let filtered = allPaths.filter(
      (path, index) =>
        path.getEaten(board).length == allPaths[0].getEaten(board).length
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
