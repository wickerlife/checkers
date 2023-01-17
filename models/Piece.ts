import React from "react";
import { damanypink, orange, selectiveyellow } from "../utils/colors";
import { Player } from "./Player";
import { Position } from "./Position";

export interface PieceInterface {
  id: number;
  player: Player;
  position: Position;
  isdama?: boolean;
}

/**
 * Class that identifies a piece on the board.
 *
 * @property {number} id Unique identifier for each piece on the board.
 * @property {string} color Color HEX code for the piece (redoundant).
 * @property {Player} player Player the Piece belongs to.
 * @property {Position} position x-y-z coordinates of the Piece on the board.
 * @property {boolean} isdama Whether the Piece is a Dama.
 * @property {Ref} ref Ref to the Three.js 3D object.
 */
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

  /**
   * @returns {string} Returns the HEX string of the color of the Dama depending on the piece color.
   */
  getDamaColor() {
    if (this.color == selectiveyellow) {
      return orange;
    } else {
      return damanypink;
    }
  }
}
