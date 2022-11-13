import React, { Ref, useRef } from "react";
import { DirectionalLight, OrthographicCamera } from "three";

export const Light = () => {
  const light = useRef() as Ref<DirectionalLight>;
  const camera = useRef() as Ref<OrthographicCamera>;
  //useHelper(camera, CameraHelper);
  //useHelper(light, DirectionalLightHelper);
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[-10, 0, -20]} color="white" intensity={2.5} />
      <pointLight position={[0, -10, 0]} intensity={1.5} />
      <directionalLight
        ref={light}
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
