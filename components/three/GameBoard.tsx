import React, { useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  boardAtom,
  moveAtom,
  pieceAtomList,
  selectedAtom,
  pathsAtom,
  turnAtom,
} from "../../utils/atoms";
import { GamePiece } from "./GamePiece";
import { BaseBoard } from "./BaseBoard";
import { Target } from "./Target";
import { useFrame } from "@react-three/fiber";

/**
 * Stateful component. Retrieves Board info from state.
 * @returns JSX.Element
 */
export const GameBoard = () => {
  const board = useAtomValue(boardAtom);
  const pieceAtoms = useAtomValue(pieceAtomList);
  const [selected, setSelected] = useAtom(selectedAtom);
  const [paths, setPaths] = useAtom(pathsAtom);
  const move = useAtomValue(moveAtom);

  useEffect(() => {
    if (move != undefined) {
      setSelected(null);
      setPaths([]);
    }
  }, [move]);

  return board ? (
    <group>
      {/* Board sides and tiles */}
      <BaseBoard></BaseBoard>

      {/* Board pieces */}
      {pieceAtoms.map((pieceAtom, index) => {
        return <GamePiece pieceAtom={pieceAtom} key={index} />;
      })}

      {/* Targets */}
      {paths.map((path, index) => {
        return (
          <Target
            key={`${index}:${path.steps.length}:${path.steps.at(-1)!.x}:${
              path.steps.at(-1)!.y
            }`}
            path={path}
          ></Target>
        );
      })}
    </group>
  ) : null;
};
