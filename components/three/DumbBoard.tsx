import React from "react";
import { Board } from "../../models/Board";
import { BaseBoard } from "./BaseBoard";
import { DumbPiece } from "./DumbPiece";

interface BoardInterface {
  board: Board;
}

/**
 * Board that reflects an initial state of a disabled (@link Board).
 *
 * @returns {JSX.Element} DumbBoard component
 */
export const DumbBoard = ({ board }: BoardInterface) => {
  return (
    <group>
      {/* Board sides and tiles */}
      <BaseBoard></BaseBoard>

      {/* Board pieces */}
      {board.pieces.map((piece, index) => {
        return <DumbPiece piece={piece} key={index} />;
      })}
    </group>
  );
};
