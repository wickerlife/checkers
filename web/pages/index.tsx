import React, { Ref, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";

// Components
import { Board } from "../components/game/Board";
import { OrbitControls, softShadows, useHelper } from "@react-three/drei";
import {
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  OrthographicCamera,
} from "three";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";

//softShadows();

const Plane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <shadowMaterial attach="material" transparent opacity={0.4} />
    </mesh>
  );
};

const Light = () => {
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

export default function Home() {
  return (
    <div className="fixed w-screen h-screen place-content-center">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [10, 20, 20], zoom: 30 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        {/** Lighting */}
        <Light></Light>
        <Plane />
        <Board></Board>
        <gridHelper args={[100, 100, `grey`, `grey`]} position={[0, -0.1, 0]} />

        <OrbitControls
          autoRotate={true}
          autoRotateSpeed={-0.7}
          zoomSpeed={0.25}
          minZoom={40}
          maxZoom={140}
          enablePan={false}
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 3}
        />
        <Suspense fallback={null}>
          <EffectComposer resolutionScale={1}>
            <Bloom luminanceThreshold={0} luminanceSmoothing={2} height={400} />
            <Vignette offset={0.5} darkness={0.6} eskil={true} />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <div className="fixed flex w-full bottom-20 place-content-center">
        <p className="text-gray-500 align-middle dark:text-gray-400">
          Please press{" "}
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            Enter
          </kbd>{" "}
          to start a new game...
        </p>
      </div>
    </div>
  );
}
