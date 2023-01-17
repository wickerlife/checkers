import React, { Ref, Suspense, useEffect, useRef } from "react";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
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
import { playersAtom } from "../utils/atoms";
import { useSetAtom } from "jotai";
import { GameMode } from "../components/ui/GameMode";
import { Player } from "../models/Player";
import { nypink, selectiveyellow } from "../utils/colors";
import { DirectionalLight } from "three";
import Head from "next/head";

/**
 * Index page of the website
 * @returns {JSX.Element} Game component
 */
export default function Home() {
  const router = useRouter();
  const lightRef = useRef() as Ref<DirectionalLight>;

  // Load initial state
  const [modal, showModal] = useState(false);
  const [board] = useState(Board.randomBoard());
  const setPlayers = useSetAtom(playersAtom);

  useKeyPress(() => {
    showModal(true);
  }, "Enter");
  useKeyPress(() => showModal(false), "Escape");

  useEffect(() => {
    setPlayers([]);
    router.prefetch("/game");
  });

  return board ? (
    <>
      <Head>
        <title>Mai Checkers</title>
      </Head>
      <div className="fixed z-0 items-center justify-center w-screen h-screen align-middle place-content-center">
        <Canvas
          dpr={1} // resolution
          frameloop="demand"
          shadows
          camera={{ position: [10, 20, 20], zoom: 25 }}
          gl={{ preserveDrawingBuffer: true }}
          onPointerMissed={() => showModal(false)}
        >
          {/** Scene Lighting */}
          <Light lightRef={lightRef}></Light>
          <Selection>
            {/* Checkers Board (pieces included) */}
            {/* <DumbBoard board={board}></DumbBoard> */}
            <DumbBoard board={board}></DumbBoard>
            {/* Orbit controls allows the user to rotate the visual horizontally */}
            <OrbitControls
              autoRotate={true}
              autoRotateSpeed={-0.7}
              dampingFactor={0.05}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 3}
              enablePan={false}
              enableDamping={modal ? false : true}
              enableZoom={false}
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

                <DepthOfField
                  focusDistance={0}
                  focalLength={0.02}
                  bokehScale={modal ? 10 : 0}
                ></DepthOfField>
              </EffectComposer>
            </Suspense>
          </Selection>
        </Canvas>
      </div>

      <div className="z-50 flex flex-col w-full h-[100vh] py-[88px] ">
        {/* Modal screen to allow choice of game mode: One-device or Multi-device */}
        <div
          className={`flex flex-col h-full mx-[22px] z-50 place-content-center gap-11 justify-center items-center md:flex-row md:flex-1 ${
            modal ? "visible" : "invisible"
          }`}
        >
          <GameMode
            subtitle="Multiplayer"
            heading="Single Device"
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
              <Light lightRef={lightRef}></Light>
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
              <Light lightRef={lightRef}></Light>
              <DumbBoard
                board={Board.startBoard([
                  new Player({
                    id: 1,
                    username: "Player1",
                    color: selectiveyellow,
                  }),

                  new Player({
                    id: 2,
                    username: "Player2",
                    color: nypink,
                  }),
                ])}
              ></DumbBoard>
            </Canvas>
          </GameMode>
        </div>

        {/* Overlay message: Press enter to start playing */}
        <div
          className={`invisible flex bottom-20 z-50 place-content-center ${
            modal ? "invisible h-0" : "sm:visible"
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

        {/* Start button for phones */}
        <div
          className={`z-50 flex w-full place-content-center bottom-20 sm:invisible ${
            modal ? "invisible h-0" : "sm:visible"
          }
          `}
        >
          <button
            className="max-w-[300px] text-white font-medium bg-selectiveyellow px-16 py-6 hover:scale-105 transition ease-in-out rounded-[16px]"
            onClick={() => showModal(true)}
          >
            Start a new game
          </button>
        </div>
      </div>
    </>
  ) : null;
}
