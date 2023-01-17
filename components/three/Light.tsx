import React, { Ref, useRef } from "react";
import { DirectionalLight, OrthographicCamera } from "three";

interface LightInterface {
  lightRef: Ref<DirectionalLight>;
}

/**
 * Displayes a 3D light object
 *
 * @returns {JSX.Element} Light component
 */
export const Light = ({ lightRef }: LightInterface) => {
  const camera = useRef() as Ref<OrthographicCamera>;

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[-10, 0, -20]} color="white" intensity={2.5} />
      <pointLight position={[0, -10, 0]} intensity={1.5} />
      <directionalLight
        ref={lightRef}
        castShadow
        position={[10, 10, -10]}
        intensity={1.5}
        shadow-mapSize-width={2024}
        shadow-mapSize-height={2024}
      >
        <orthographicCamera
          ref={camera}
          attach="shadow-camera"
          args={[-10, 10, 10, -10]}
        />
      </directionalLight>
    </>
  );
};
