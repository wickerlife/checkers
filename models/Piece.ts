import { Position } from "./Position";

export class Piece {
  id: number;
  color: string;
  position: Position;
  isdama: boolean;
  isselected: boolean;

  constructor(id: number, color: string, position: Position) {
    this.id = id;
    this.color = color;
    this.position = position;
  }

  move() {}

  upgradeToDama() {}

  select() {}

  deselect() {}
}
