import React from "react";
import { useAtom, useAtomValue } from "jotai";
import { boardAtom, pieceAtomList } from "../../utils/atoms";
import { GamePiece } from "./GamePiece";
import { BaseBoard } from "./BaseBoard";

/**
 * Stateful component. Retrieves Board info from state.
 * @returns JSX.Element
 */
export const GameBoard = () => {
  const board = useAtomValue(boardAtom);
  const [pieceAtoms] = useAtom(pieceAtomList);

  return board ? (
    <group>
      {/* Board sides and tiles */}
      <BaseBoard></BaseBoard>

      {/* Board pieces */}
      {pieceAtoms.map((pieceAtom, index) => {
        return <GamePiece pieceAtom={pieceAtom} key={index} />;
      })}
    </group>
  ) : null;
};
