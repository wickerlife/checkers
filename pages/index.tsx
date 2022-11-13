import React, { Suspense } from "react";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, softShadows } from "@react-three/drei";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";

// Components
import { Board } from "../components/three/Board";
import { Light } from "../components/three/Light";

export default function Home() {
  const [modal, showModal] = useState(false);

  return (
    <div className="fixed w-screen h-screen place-content-center">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [10, 20, 20], zoom: 30 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        {/** Scene Lighting */}
        <Light></Light>

        {/* Checkers Board (pieces included) */}
        <Board></Board>

        {/* Orbit controls allows the user to rotate the visual horizontally */}
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

        {/* Visual effects: Glow and Vignette around the corners  */}
        <Suspense fallback={null}>
          <EffectComposer resolutionScale={1}>
            <Bloom luminanceThreshold={0} luminanceSmoothing={2} height={400} />
            <Vignette offset={0.5} darkness={0.6} eskil={true} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Overlay message: Press enter to start playing */}
      <div className="fixed flex w-full bottom-20 place-content-center">
        <p className="text-gray-500 align-middle dark:text-gray-400">
          Please press{" "}
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            Enter
          </kbd>{" "}
          to start a new game...
        </p>
      </div>

      {/* Modal screen to allow choice of game mode: One-device or Multi-device */}
      {modal ? <div>Modal</div> : null}
    </div>
  );
}
