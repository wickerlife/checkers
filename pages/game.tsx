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
import { Ref, Suspense, useEffect, useRef, useState } from "react";
import React from "react-dom";
import { DirectionalLight } from "three";
import { GameBoard } from "../components/three/GameBoard";
import { Light } from "../components/three/Light";
import { InputMenu } from "../components/ui/InputMenu";
import { TurnWidget } from "../components/ui/TurnWidget";
import { useKeyPress, useCurrentSize, Size } from "../hooks/hooks";
import { Board } from "../models/Board";
import { Player } from "../models/Player";
import {
  boardAtom,
  playersAtom,
  selectedAtom,
  pathsAtom,
  turnAtom,
  moveAtom,
  turnChangeAtom,
  gameStateAtom,
  GameState,
} from "../utils/atoms";
import { nypink, selectiveyellow } from "../utils/colors";

export default function Game() {
  const router = useRouter();
  const lightRef = useRef() as Ref<DirectionalLight>;

  // Local state
  const [playerName, setPlayerName] = useState("");
  const [pressedEnter, setPressedEnter] = useState(false);
  const [pressedEscape, setPressedEscape] = useState(false);
  const size = useCurrentSize();

  // Global state
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const setSelected = useSetAtom(selectedAtom);
  const setPaths = useSetAtom(pathsAtom);
  const [players, setPlayers] = useAtom(playersAtom);
  const [board, setBoard] = useAtom(boardAtom);
  const [turn, setTurn] = useAtom(turnAtom);
  const turnChange = useAtomValue(turnChangeAtom);
  const setMove = useSetAtom(moveAtom);

  const addPlayer = (value: string, players: Array<Player>) => {
    let player = new Player({
      id: players.length > 0 ? 2 : 1,
      username: value,
      color: players.length > 0 ? nypink : selectiveyellow,
    });
    setPlayerName("");

    if (players.length > 0) {
      setTurn(players[0]);
    }

    if ([...players, player].length == 2) setGameState(GameState.GameStarted);
    setPlayers([...players, player]);
  };

  const removePlayer = (players: any) => {
    console.log("remove player");
    let temp = players;
    let prev = temp.shift();
    setPlayers(temp);
    if (prev) setPlayerName(prev.username);
  };

  const getMinDistance = (size: Size) => {
    let ratio = size.width / size.height;

    if (size.width < 850) return 35 / ratio;
    else return 60 / ratio;
  };

  const getMaxDistance = (size: Size) => {
    return getMinDistance(size);
  };

  // Initialize correct board
  useEffect(() => {
    if (players.length > 1) {
      setBoard(Board.startBoard(players.sort((a, b) => a.id - b.id)));
    }
  }, [players]);

  // Handle Turn Change
  useEffect(() => {
    if (turnChange != undefined) {
      let newturn = players.filter((player) => player.id != turnChange.id)[0];
      // Detect end Game
      if (Board.getPlayerPieces(board, turn).length == 0) {
        // Game ended
        setGameState(GameState.GameEnded);
      } else {
        // Detect mandatory Move
        let mandatory = Board.mandatoryPaths(board, turn);
        if (mandatory.length > 0) {
          // TODO Suggest mandatory path
        }

        // Change turn normally
        setTurn(newturn);
      }
    }
  }, [turnChange, players, board]);

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
  // useEffect(() => {
  //   const unloadCallback = (event: any) => {
  //     event.preventDefault();
  //     event.returnValue = "";
  //     return "";
  //   };

  //   window.addEventListener("beforeunload", unloadCallback);
  //   return () => window.removeEventListener("beforeunload", unloadCallback);
  // }, []);

  return (
    <>
      <div
        className={`w-screen overflow-hidden  ${
          players.length < 2 ? "" : "absolute top-[50%] translate-y-[-45%] "
        }`}
      >
        <div className="flex flex-col overflow-hidden">
          {/* Player name selection -- only visible when submiting player names */}
          <div
            className={`w-screen place-content-center ${
              players.length != 2 ? "visible h-screen" : "invisible h-0"
            } flex flex-col justify-center items-center`}
          >
            <InputMenu
              visible={players.length < 2}
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
        </div>
      </div>
      {/* Game board section */}
      <div
        className={`fixed h-screen flex-1 overflow-hidden w-screen z-20 ${
          players.length == 2 ? "visible" : "invisible h-0 w-0"
        }`}
      >
        <Canvas
          dpr={1.8} // resolution
          frameloop="demand"
          shadows
          camera={{ position: [0, 20, 20], zoom: 5 }}
          gl={{ preserveDrawingBuffer: true }}
          onPointerMissed={() => {
            setSelected(null);
            setPaths([]);
            setMove(undefined);
          }}
        >
          <Light lightRef={lightRef}></Light>
          {/* Orbit controls allows the user to rotate the visual horizontally */}
          <OrbitControls
            maxAzimuthAngle={Math.PI / 3}
            minAzimuthAngle={-Math.PI / 3}
            minPolarAngle={size.width < 650 ? Math.PI / 9 : Math.PI / 4}
            maxPolarAngle={size.width < 650 ? Math.PI / 9 : Math.PI / 3}
            minDistance={getMinDistance(size)}
            maxDistance={getMaxDistance(size)}
            enablePan={false}
            enableZoom={false}
            enableRotate={size.width < 650 ? false : true}
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
                  lights={[lightRef]}
                  luminanceThreshold={0}
                  luminanceSmoothing={2}
                  height={300}
                />
                <Outline edgeStrength={5} xRay={false} />
              </EffectComposer>
            </Suspense>
          </Selection>
        </Canvas>
        {/** Overlay Turn Indicator */}
        <div
          className={`fixed flex bottom-[44px] place-content-center w-screen z-30 ${
            gameState == GameState.GameStarted ? "" : "invisible"
          }`}
        >
          <div className="text-gray-500 align-middle dark:text-gray-400">
            <div className=" flex align-middle justify-center items-center gap-[11px] px-4 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500 min-w-[135px]">
              <div
                className={`w-[22px] h-[22px] rounded-full inline-block bg-[${turn.color}]`}
              ></div>
              {`${turn.username}'s turn`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
