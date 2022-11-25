import React, { Suspense, useEffect } from "react";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerformanceMonitor } from "@react-three/drei";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Vignette,
  Selection,
} from "@react-three/postprocessing";

// Components
import { Light } from "../components/three/Light";
import { DumbBoard } from "../components/three/DumbBoard";

// Models
import { Board } from "../models/Board";

// State Toms
import { useRouter } from "next/router";
import { useKeyPress } from "../hooks/hooks";
import { GameMode } from "../components/ui/GameMode";
import { GameBoard } from "../components/three/GameBoard";

export default function Home() {
  // Load initial state
  const [modal, showModal] = useState(false);
  const [board, setBoard] = useState(Board.randomBoard());
  // const [selected, setSelected] = useAtom(selectedAtom);
  const router = useRouter();

  useKeyPress(() => {
    //setSelected(null);
    showModal(true);
  }, "Enter");
  useKeyPress(() => showModal(false), "Escape");

  useEffect(() => {
    router.prefetch("/welcome");
    router.prefetch("/treasurehunt");
  });

  return board ? (
    <div className="fixed w-screen h-screen place-content-center">
      <Canvas
        dpr={1} // resolution
        frameloop="demand"
        shadows
        camera={{ position: [10, 20, 20], zoom: 25 }}
        gl={{ preserveDrawingBuffer: true }}
        //onPointerMissed={() => setSelected(null)}
      >
        {/** Scene Lighting */}
        <Light></Light>
        <Selection>
          {/* Checkers Board (pieces included) */}
          {/* <DumbBoard board={board}></DumbBoard> */}
          <DumbBoard board={board}></DumbBoard>
          {/* Orbit controls allows the user to rotate the visual horizontally */}
          <OrbitControls
            autoRotate={true}
            autoRotateSpeed={-0.7}
            zoomSpeed={0.6}
            minZoom={40}
            maxZoom={140}
            dampingFactor={0.05}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 3}
            enablePan={false}
            enableDamping={modal ? false : true}
            enableZoom={modal ? false : true}
            enableRotate={modal ? false : true}
          />
          {/* Visual effects: Glow and Vignette around the corners  */}
          <Suspense fallback={null}>
            <EffectComposer
              resolutionScale={1}
              multisampling={8}
              autoClear={false}
            >
              <Bloom
                luminanceThreshold={0}
                luminanceSmoothing={2}
                height={300}
              />
              <Vignette offset={0.5} darkness={0.6} eskil={false} />
              {/* <Outline
                edgeStrength={5}
                xRay={false}
              /> */}

              <DepthOfField
                focusDistance={0}
                focalLength={0.02}
                bokehScale={modal ? 10 : 0}
              ></DepthOfField>
            </EffectComposer>
          </Suspense>
        </Selection>
      </Canvas>

      {/* Overlay message: Press enter to start playing */}
      <div
        className={`fixed flex w-full bottom-20 place-content-center ${
          modal ? "invisible" : ""
        }`}
      >
        <p className="text-gray-500 align-middle dark:text-gray-400">
          Please press{" "}
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            Enter
          </kbd>{" "}
          to start a new game...
        </p>
      </div>

      {/* Modal screen to allow choice of game mode: One-device or Multi-device */}

      <div
        className={`fixed flex w-full inset-0 place-content-center gap-20 top-[50%]  mt-[-250px]  ${
          modal ? "" : "invisible"
        }`}
      >
        <GameMode
          subtitle="Multiplayer"
          heading="One-Device"
          text="Play against your opponent on the same device in turns"
          onClick={() => {
            router.push("/game");
          }}
        >
          <Canvas
            dpr={2} // resolution
            frameloop="demand"
            shadows
            camera={{ position: [20, 20, 10], zoom: 4 }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <Light></Light>
            <DumbBoard board={Board.randomBoard()}></DumbBoard>
          </Canvas>
        </GameMode>
        <GameMode
          subtitle="Multiplayer"
          heading="Multiple Devices"
          text="Start a game and send the link to your opponent to play on different devices"
          onClick={() => {
            // Start Server connection
          }}
        >
          <Canvas
            dpr={2} // resolution
            frameloop="demand"
            shadows
            camera={{ position: [20, 20, 10], zoom: 4 }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <Light></Light>
            <DumbBoard board={Board.startBoard()}></DumbBoard>
          </Canvas>
        </GameMode>
      </div>
    </div>
  ) : null;
}
