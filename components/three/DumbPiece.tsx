import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import React from "react";
import { BufferGeometry, Vector3 } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Piece } from "../../models/Piece";

interface PieceInterface {
  piece: Piece;
  onSelect?: any;
}

type GLTFResult = GLTF & {
  nodes: {
    piece: THREE.Mesh;
  };
  materials: {};
};

export const DumbPiece = ({ piece, onSelect }: PieceInterface) => {
  const { nodes, materials } = useLoader(
    GLTFLoader,
    "/models/piece.glb"
  ) as GLTFResult;

  return (
    <group>
      <mesh
        ref={piece.ref}
        scale={new Vector3(0.3, 0.05, 0.3)}
        position={
          new Vector3(piece.position.x - 3.5, 0.15, piece.position.y - 3.5)
        }
        castShadow
        receiveShadow
        geometry={nodes.piece.geometry}
        onClick={(e) => onSelect}
      >
        <meshStandardMaterial color={piece.color} metalness={0} roughness={0} />
      </mesh>
    </group>
  );
};
