import { ThreeElements } from "@react-three/fiber";
import React, { Ref } from "react";
import { Player } from "./Player";
import { Position } from "./Position";

export interface PieceInterface {
  id: number;
  player: Player;
  position: Position;
  isdama?: boolean;
}

export class Piece {
  id: number;
  color: string;
  player: Player;
  position: Position;
  isdama: boolean;
  ref: any;

  constructor({ id, player, position, isdama = false }: PieceInterface) {
    this.id = id;
    this.color = player.color;
    this.player = player;
    this.position = position;
    this.isdama = isdama;
    this.ref = React.createRef();
  }

  move() {}

  upgradeToDama() {}
}
