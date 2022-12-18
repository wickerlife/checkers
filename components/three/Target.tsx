import { useAtom, useSetAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import React from "react";
import { Move } from "../../models/Move";
import { Path } from "../../models/Path";
import { Piece } from "../../models/Piece";
import { Position } from "../../models/Position";
import {
  moveAtom,
  pieceAtomList,
  selectedAtom,
  turnAtom,
} from "../../utils/atoms";
import { DumbPiece } from "./DumbPiece";

interface TargetInterface {
  path: Path;
}

export const Target = ({ path }: TargetInterface) => {
  const [selected, setSelected] = useAtom(selectedAtom);
  const setMove = useSetAtom(moveAtom);
  const target = path.steps.at(-1)!;

  let piece = new Piece({
    id: target.x * target.y,
    player: selected!.player,
    position: target,
    isdama: selected!.isdama,
  });

  return (
    selected && (
      <DumbPiece
        piece={piece}
        trasparent={true}
        onSelect={() => {
          setMove(
            new Move({
              player: selected.player,
              piece: selected,
              position: target,
              path: path,
            })
          );
        }}
      ></DumbPiece>
    )
  );
};
