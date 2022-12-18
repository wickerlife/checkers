import { useGLTF } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import React from "react";
import { BufferGeometry, Vector3 } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Piece } from "../../models/Piece";

interface PieceInterface {
  piece: Piece;
  onSelect?: any;
  trasparent?: boolean;
}

type GLTFResult = GLTF & {
  nodes: {
    piece: THREE.Mesh;
  };
  materials: {};
};

export const DumbPiece = ({
  piece,
  onSelect,
  trasparent = false,
}: PieceInterface) => {
  const { nodes, materials } = useLoader(
    GLTFLoader,
    "/models/piece.glb"
  ) as GLTFResult;

  useFrame(() => {
    let vec = new Vector3(
      piece.position.x - 3.5,
      piece.position.z,
      piece.position.y - 3.5
    );
    piece.ref.current.position.lerp(vec, 0.1);
  });

  return (
    <group>
      <mesh
        ref={piece.ref}
        scale={new Vector3(0.3, 0.05, 0.3)}
        position={
          new Vector3(
            piece.position.x - 3.5,
            piece.position.z,
            piece.position.y - 3.5
          )
        }
        castShadow
        receiveShadow
        geometry={nodes.piece.geometry}
        onClick={(e) => {
          if (onSelect) {
            onSelect();
          }
        }}
      >
        <meshStandardMaterial
          color={piece.color}
          metalness={0}
          roughness={0}
          transparent={trasparent}
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};
