import { useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import React, { useRef } from "react";
import { Vector3 } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

interface PieceInterface {
  color: string;
  scale: Vector3;
  position: Vector3;
}

type GLTFResult = GLTF & {
  nodes: {
    piece: THREE.Mesh;
  };
  materials: {};
};

export const Piece = ({ color, scale, position }: PieceInterface) => {
  const { nodes, materials } = useGLTF("/models/piece.glb") as GLTFResult;
  const pieceRef = useRef(null);
  return (
    <group>
      <mesh
        ref={pieceRef}
        scale={scale}
        position={position}
        castShadow
        receiveShadow
        geometry={nodes.piece.geometry}
      >
        <meshStandardMaterial color={color} metalness={0} roughness={0} />
      </mesh>
    </group>
  );
};
