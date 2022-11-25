import { useGLTF } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Outline,
  Select,
} from "@react-three/postprocessing";
import { Atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { Ref, useRef } from "react";
import { Vector3 } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Piece } from "../../models/Piece";
import { boardAtom, enabledBoardAtom, selectedAtom } from "../../utils/atoms";
import { DumbPiece } from "./DumbPiece";

interface PieceInterface {
  pieceAtom: Atom<Piece>;
}

/**
 * Stateful component
 * @param {pieceAtom}
 * @returns JSX.Element
 */
export const GamePiece = ({ pieceAtom }: PieceInterface) => {
  const piece = useAtomValue(pieceAtom);
  const [selected, setSelected] = useAtom(selectedAtom);
  const enabled = useAtomValue(enabledBoardAtom);

  return (
    <group>
      <Select enabled={selected?.id == piece.id}>
        <DumbPiece
          piece={piece}
          onSelect={() => {
            if (enabled) setSelected(piece);
          }}
        ></DumbPiece>
      </Select>
    </group>
  );
};
