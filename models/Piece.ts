import React from "react";
import { Position } from "./Position";

export class Piece {
  id: number;
  color: string;
  position: Position;
  isdama: boolean;
  ref: any;

  constructor(
    id: number,
    color: string,
    position: Position,
    isdama: boolean = false
  ) {
    this.id = id;
    this.color = color;
    this.position = position;
    this.isdama = isdama;
    this.ref = React.createRef();
  }

  move() {}

  upgradeToDama() {}
}
