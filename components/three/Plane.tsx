import React from "react";

/**
 * Displayes a 3D plane for development purposes
 *
 * @returns {JSX.Element} Plane component
 */
export const Plane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <shadowMaterial attach="material" transparent opacity={0.4} />
    </mesh>
  );
};
