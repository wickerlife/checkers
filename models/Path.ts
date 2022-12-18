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

  getEaten = (board: Board): Array<Piece> => {
    let eaten = [] as Array<Piece>;
    this.steps.forEach((step, index) => {
      if (this.steps.length > index + 1) {
        let coordx = (step.x + this.steps[index + 1].x) / 2;
        let coordy = (step.y + this.steps[index + 1].y) / 2;
        if (Number.isInteger(coordx) && Number.isInteger(coordy)) {
          let position = new Position(coordx, coordy);
          let piece = Board.getPiece(board, position);
          if (piece != undefined) eaten.push(piece);
        }
      }
    });
    return eaten;
  };

  getSteps = () => {
    return this.steps.length;
  };
}
