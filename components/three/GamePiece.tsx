import { useFrame } from "@react-three/fiber";
import { Select } from "@react-three/postprocessing";
import { Atom, PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { Vector3 } from "three";
import { Board } from "../../models/Board";
import { Piece } from "../../models/Piece";
import { Position } from "../../models/Position";
import {
  boardAtom,
  enabledBoardAtom,
  moveAtom,
  selectedAtom,
  pathsAtom,
  turnAtom,
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
  const [piece, setPiece] = useAtom(pieceAtom);
  const enabled = useAtomValue(enabledBoardAtom);
  const turn = useAtomValue(turnAtom);
  const board = useAtomValue(boardAtom);
  // Process Piece Click
  const [selected, setSelected] = useAtom(selectedAtom);
  const setPaths = useSetAtom(pathsAtom);
  // Process move
  const [move, setMove] = useAtom(moveAtom);
  const [lerped, setLerped] = useState(false);

  // useFrame(() => {
  //   if (
  //     move != undefined &&
  //     move.piece.id == piece.id &&
  //     piece.ref != null &&
  //     lerped == false
  //   ) {
  //     let vec = new Vector3(
  //       piece.position.x - 3.5,
  //       piece.position.z,
  //       piece.position.y - 3.5
  //     );
  //     piece.ref.current.position.lerp(vec, 0.1);
  //     setLerped(false);
  //     console.log("LERPED");
  //   }
  // });

  // useEffect(() => {
  //   if (move == undefined || piece == undefined) return;

  //   // TODO Process move
  //   // Piece was moved
  //   if (move.piece.id == piece.id) {
  //     let temp = new Piece({
  //       id: move.piece.id,
  //       player: move.player,
  //       position: move.position,
  //     });
  //     setPiece(temp);
  //   } else if () {
  //     let eaten = move.path.getEaten(board);
  //     let eatenIds = eaten.map((piece) => piece.id);
  //     if (eatenIds.includes(piece.id)) {
  //       setPiece(undefined);
  //     }
  //   }

  //   // Remove piece if it was eaten

  //   // Remove processed move from queue
  //   setMove(undefined);
  // }, [move, piece]);

  return (
    <group>
      <Select enabled={selected?.id == piece!.id}>
        <DumbPiece
          piece={piece!}
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
