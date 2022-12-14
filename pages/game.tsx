import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Outline,
  SelectiveBloom,
  Selection,
} from "@react-three/postprocessing";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import React from "react-dom";
import { GameBoard } from "../components/three/GameBoard";
import { Light } from "../components/three/Light";
import { InputMenu } from "../components/ui/InputMenu";
import { useKeyPress } from "../hooks/hooks";
import { Player } from "../models/Player";
import { playersAtom, selectedAtom, turnAtom } from "../utils/atoms";
import { nypink, selectiveyellow } from "../utils/colors";

export default function Game() {
  console.log("RENDER");
  const router = useRouter();
  // Local state
  const [playerName, setPlayerName] = useState("");
  const [pressedEnter, setPressedEnter] = useState(false);
  const [pressedEscape, setPressedEscape] = useState(false);

  // Global state
  const setSelected = useSetAtom(selectedAtom);
  const [players, setPlayers] = useAtom(playersAtom);
  const [turn, setTurn] = useAtom(turnAtom);

  const addPlayer = (value: string, players: any) => {
    console.log("Register player");
    let player = new Player({
      id: players.length > 0 ? 1 : 2,
      username: value,
      color: players.length > 0 ? selectiveyellow : nypink,
    });
    setPlayerName("");

    if (players.length > 0) {
      setTurn(players[0]);
    }
    setPlayers([...players, player]);
    console.log(players.length + 1);
  };

  const removePlayer = (players: any) => {
    console.log("remove player");
    let temp = players;
    let prev = temp.shift();
    setPlayers(temp);
    if (prev) setPlayerName(prev.username);
  };

  // Listen to enter keypress
  useEffect(() => {
    if (!pressedEnter) return;

    if (players.length < 2) {
      if (playerName.length > 2) addPlayer(playerName, players);
    }
    setPressedEnter(false);
  }, [pressedEnter, players, playerName]);

  // Listen to escape keypress
  useEffect(() => {
    if (!pressedEscape) return;

    if (players.length == 1) {
      removePlayer(players);
    } else if (players.length < 1) {
      router.back();
    } else {
      // Open Options Menu
    }

    setPressedEscape(false);
  }, [pressedEscape, players]);

  // Register kepress listeners
  useKeyPress(() => setPressedEnter(true), "Enter");
  useKeyPress(() => setPressedEscape(true), "Escape");

  //PREVENT PAGE REFRESH
  useEffect(() => {
    const unloadCallback = (event: any) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Player name selection -- only visible when submiting player names */}
      <div
        className={`w-screen place-content-center ${
          players.length != 2 ? "visible h-screen" : "invisible h-0"
        } flex flex-col justify-center items-center`}
      >
        <InputMenu
          value={playerName}
          label={`${players.length > 0 ? "Second" : "First"} player's name`}
          inputHint="Name..."
          btnText="Next"
          backBtn={players.length > 0 ? true : false}
          backBtnEnabled={playerName.length > 2}
          onSubmit={() => {
            addPlayer(playerName, players);
          }}
          onChange={(e: any) => {
            setPlayerName(e.target.value);
          }}
          onBack={() => {
            removePlayer(players);
          }}
        ></InputMenu>

        {/* Overlay message: Press enter to start playing */}
        <div
          className={`relative flex top-[44px] place-content-center ${
            playerName.length < 3 ? "invisible" : ""
          }`}
        >
          <p className="text-gray-500 align-middle dark:text-gray-400">
            Press{" "}
            <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              Enter
            </kbd>{" "}
            to continue...
          </p>
        </div>
      </div>
      {/* Game board section */}
      <div
        className={`w-screen place-content-center ${
          players.length == 2 ? "visible h-screen" : "invisible h-0"
        }`}
      >
        <Canvas
          dpr={1.8} // resolution
          frameloop="demand"
          shadows
          camera={{ position: [0, 20, 20], zoom: 5 }}
          gl={{ preserveDrawingBuffer: true }}
          onPointerMissed={() => setSelected(null)}
        >
          <Light></Light>
          {/* Orbit controls allows the user to rotate the visual horizontally */}
          <OrbitControls
            maxAzimuthAngle={Math.PI / 3}
            minAzimuthAngle={-Math.PI / 3}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 3}
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
          />
          <Selection>
            <GameBoard></GameBoard>

            <Suspense fallback={null}>
              <EffectComposer
                resolutionScale={1}
                multisampling={8}
                autoClear={false}
              >
                <SelectiveBloom
                  luminanceThreshold={0}
                  luminanceSmoothing={2}
                  height={300}
                />
                <Outline edgeStrength={5} xRay={false} />
              </EffectComposer>
            </Suspense>
          </Selection>
        </Canvas>
      </div>
    </div>
  );
}
