import { Board } from "./Board";
import { Piece } from "./Piece";
import { Position } from "./Position";

interface PathInterface {
  steps: Array<Position>;
}

export class Path {
  steps: Array<Position>;

  valueOf() {
    return this.getSteps();
  }

  constructor({ steps }: PathInterface) {
    this.steps = steps;
  }

  compare = (path: Path): boolean => {
    if (path.steps.length != this.steps.length) return false;

    for (let index = 0; index < path.steps.length; index++) {
      if (this.steps[index].compare(path.steps[index]) == false) return false;
    }
    return true;
  };

  isincluded = (paths: Array<Path>): boolean => {
    for (var index = 0; index < paths.length; index++) {
      if (this.compare(paths[index]) == true) {
        return true;
      }
    }
    return false;
  };

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

  getSteps = () => {
    return this.steps.length;
  };
}
