import { Select } from "@react-three/postprocessing";
import { PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { useState } from "react";
import { Board } from "../../models/Board";
import { Piece } from "../../models/Piece";
import {
  boardAtom,
  enabledBoardAtom,
  moveAtom,
  selectedAtom,
  pathsAtom,
  turnAtom,
  mandatoryPathsAtom,
} from "../../utils/atoms";
import { DumbPiece } from "./DumbPiece";

interface PieceInterface {
  pieceAtom: PrimitiveAtom<Piece | undefined>;
}

/**
 * Stateful component
 * @param {pieceAtom}
 * @returns JSX.Element
 */
export const GamePiece = ({ pieceAtom }: PieceInterface) => {
  const piece = useAtomValue(pieceAtom);
  const enabled = useAtomValue(enabledBoardAtom);
  const turn = useAtomValue(turnAtom);
  const board = useAtomValue(boardAtom);
  // Process Piece Click
  const [selected, setSelected] = useAtom(selectedAtom);
  const setPaths = useSetAtom(pathsAtom);

  const isMandatoryOrigin = (board: Board, id: number) => {
    let isorigin = false;
    if (board.mandatoryPaths.length != 0) {
      board.mandatoryPaths.forEach((path) => {
        let origin = Board.getPiece(board, path.steps[0]);
        if (origin?.id == id) {
          isorigin = true;
        }
      });
    }
    return isorigin;
  };

  return (
    <group>
      <Select
        enabled={
          selected?.id == piece?.id || isMandatoryOrigin(board, piece!.id)
        }
      >
        <DumbPiece
          piece={piece!}
          enabled={
            turn.id == piece?.player.id &&
            board.mandatoryPaths.length == 0 &&
            board.enabled
          }
          onSelect={() => {
            if (enabled && turn.id == piece?.player.id) {
              setSelected(piece!);
              setPaths(Board.possiblePaths(board, piece!));
            }
          }}
        ></DumbPiece>
      </Select>
    </group>
  );
};
