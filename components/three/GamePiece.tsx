import { Select } from "@react-three/postprocessing";
import { PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from "jotai";
import React from "react";
import { Board } from "../../models/Board";
import { Piece } from "../../models/Piece";
import {
  boardAtom,
  enabledBoardAtom,
  selectedAtom,
  pathsAtom,
  turnAtom,
} from "../../utils/atoms";
import { DumbPiece } from "./DumbPiece";

interface PieceInterface {
  pieceAtom: PrimitiveAtom<Piece | undefined>;
}

/**
 * Stateful component, displays a Piece based on the state value of a piece.
 *
 * @param {PrimitiveAtom} pieceAtom
 * @returns {JSX.Element}
 */
export const GamePiece = ({ pieceAtom }: PieceInterface) => {
  const piece = useAtomValue(pieceAtom);
  const enabled = useAtomValue(enabledBoardAtom);
  const turn = useAtomValue(turnAtom);
  const board = useAtomValue(boardAtom);

  // Process Piece Click
  const [selected, setSelected] = useAtom(selectedAtom);
  const setPaths = useSetAtom(pathsAtom);

  /**
   * Checks whether, at turn change, this piece is involved in a mandatory move.
   *
   * @param {Board} board
   * @param {number} id
   * @returns {boolean}
   */
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
            turn?.id == piece?.player.id &&
            board.mandatoryPaths.length == 0 &&
            board.enabled
          }
          onSelect={() => {
            if (enabled && turn?.id == piece?.player.id) {
              setSelected(piece!);
              setPaths(Board.possiblePaths(board, piece!));
            }
          }}
        ></DumbPiece>
      </Select>
    </group>
  );
};
