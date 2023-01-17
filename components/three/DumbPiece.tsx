import { useCursor } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import React, { useState } from "react";
import { Vector3 } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Piece } from "../../models/Piece";

interface PieceInterface {
  piece: Piece;
  enabled?: boolean;
  onSelect?: any;
  trasparent?: boolean;
}

type GTLFResults = GLTF & {
  nodes: {
    piece: THREE.Mesh;
  };
  materials: {};
};

/**
 * Displayes a 3D object based on the piece provided in its parameters
 *
 * @returns {JSX.Element} DumbPiece component
 */
export const DumbPiece = ({
  piece,
  enabled = false,
  onSelect,
  trasparent = false,
}: PieceInterface) => {
  const { nodes, materials } = useLoader(
    GLTFLoader,
    "/models/piece.glb"
  ) as GTLFResults;
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

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
        onPointerOver={() => {
          if (enabled) setHovered(true);
        }}
        onPointerOut={() => {
          setHovered(false);
        }}
        receiveShadow
        geometry={nodes.piece.geometry}
        onClick={(e) => {
          if (onSelect && enabled) {
            onSelect();
          }
        }}
      >
        <meshStandardMaterial
          color={piece.isdama ? piece.getDamaColor() : piece.color}
          metalness={0}
          roughness={0}
          transparent={trasparent}
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};
