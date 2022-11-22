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
import { boardAtom, selectedAtom } from "../../utils/atoms";

interface PieceInterface {
  pieceAtom: Atom<Piece>;
}

type GLTFResult = GLTF & {
  nodes: {
    piece: THREE.Mesh;
  };
  materials: {};
};

/**
 * Stateful component
 * @param {atom}
 * @returns JSX.Element
 */
export const PieceUI = ({ pieceAtom }: PieceInterface) => {
  const { nodes, materials } = useGLTF("/models/piece.glb") as GLTFResult;
  const piece = useAtomValue(pieceAtom);
  const [selected, setSelected] = useAtom(selectedAtom);

  return (
    <group>
      <Select enabled={selected?.id == piece.id}>
        <mesh
          ref={piece.ref}
          scale={new Vector3(0.3, 0.05, 0.3)}
          position={
            new Vector3(piece.position.x - 3.5, 0.15, piece.position.y - 3.5)
          }
          castShadow
          receiveShadow
          geometry={nodes.piece.geometry}
          onClick={(e) => {
            console.log("PIECE CLICKED ", piece.id);
            setSelected(piece);
          }}
        >
          <meshStandardMaterial
            color={piece.color}
            metalness={0}
            roughness={0}
          />
        </mesh>
      </Select>
    </group>
  );
};
