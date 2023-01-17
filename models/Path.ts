import { Board } from "./Board";
import { Piece } from "./Piece";
import { Position } from "./Position";

interface PathInterface {
  steps: Array<Position>;
  mandatory?: boolean;
}

/**
 * Class wrapper of the state of the Path a piece can take when making a move.
 *
 * @property {Array<Position>} steps list of Positions, the steps taken in a certain path.
 * @property {boolean} mandatory If the current path is mandatory according to the rules of the game.
 */
export class Path {
  steps: Array<Position>;
  mandatory: boolean;

  // Used when comparing Paths
  valueOf() {
    return this.getSteps();
  }

  constructor({ steps, mandatory = false }: PathInterface) {
    this.steps = steps;
    this.mandatory = mandatory;
  }

  /**
   * Compares a given path with the current path
   *
   * @param {Path} path Path to compare
   * @returns {boolean}
   */
  compare = (path: Path): boolean => {
    if (path.steps.length != this.steps.length) return false;

    for (let index = 0; index < path.steps.length; index++) {
      if (this.steps[index].compare(path.steps[index]) == false) return false;
    }
    return true;
  };

  /**
   * Checks if the current {@link Path} is included in an array of paths
   *
   * @param {Array<Path>} paths
   * @returns
   */
  isincluded = (paths: Array<Path>): boolean => {
    for (var index = 0; index < paths.length; index++) {
      if (this.compare(paths[index]) == true) {
        return true;
      }
    }
    return false;
  };

  /**
   * Return list of Pieces that would be eaten with a certain path taken.
   *
   * @param {Board} board
   * @returns {Array<Piece>}
   */
  getEaten = (board: Board): Array<Piece> => {
    let eaten = [] as Array<Piece>;
    for (let index = 0; index < this.steps.length; index++) {
      if (this.steps.length > index + 1) {
        let coordx =
          Math.abs(this.steps[index].x + this.steps[index + 1].x) / 2;
        let coordy =
          Math.abs(this.steps[index].y + this.steps[index + 1].y) / 2;
        let pos = new Position(coordx, coordy);
        if (
          Number.isInteger(coordx) &&
          Number.isInteger(coordy) &&
          Board.hasPiece(board, pos)
        ) {
          let position = new Position(coordx, coordy);
          let piece = Board.getPiece(board, position);
          eaten.push(piece!);
        }
      }
    }
    return eaten;
  };

  /**
   * @returns The number of steps taken in the current path.
   */
  getSteps = () => {
    return this.steps.length;
  };
}
