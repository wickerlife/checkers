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
  const setSelected = useSetAtom(selectedAtom);
  const setPaths = useSetAtom(pathsAtom);
  const [players, setPlayers] = useAtom(playersAtom);
  const setBoard = useSetAtom(boardAtom);
  const setTurn = useSetAtom(turnAtom);
  const turnChange = useAtomValue(turnChangeAtom);
  const setMove = useSetAtom(moveAtom);

  const addPlayer = (value: string, players: Array<Player>) => {
    let player = new Player({
      id: players.length > 0 ? 1 : 2,
      username: value,
      color: players.length > 0 ? selectiveyellow : nypink,
    });
    setPlayerName("");

    if (players.length > 0) {
      if (player.color == selectiveyellow) setTurn(player);
    }
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
    let added = 0;
    //let max = size.width * ;
    //if (size.width / size.height > 1.5)
    //return Math.pow((1 / size.width) * 10000, 2) + 500;
    let c = 0;
    let ratio = size.width / size.height;

    if (size.width < 1024) return 25 / ratio + 4 / ratio;
    else return 60 / ratio + c;
  };

  const getMaxDistance = (size: Size) => {
    return getMinDistance(size);
  };

  // Initialize correct board
  useEffect(() => {
    if (players.length > 1) {
      setBoard(Board.startBoard(players.sort((a, b) => a.id - b.id)));

      // TODO Remove. this is just test code ->
      // let splayers = players.sort((a, b) => a.id - b.id);
      // let dama = new Piece({
      //   id: 1,
      //   player: splayers[0],
      //   position: new Position(5, 2),
      //   isdama: true,
      // });

      // let piece1 = new Piece({
      //   id: 2,
      //   player: splayers[1],
      //   position: new Position(6, 1),
      // });

      // let piece2 = new Piece({
      //   id: 3,
      //   player: splayers[1],
      //   position: new Position(6, 3),
      //   isdama: true,
      // });

      // let piece3 = new Piece({
      //   id: 4,
      //   player: splayers[1],
      //   position: new Position(4, 3),
      // });

      // let piece4 = new Piece({
      //   id: 4,
      //   player: splayers[1],
      //   position: new Position(7, 4),
      // });

      // let board = new Board({ pieces: [dama, piece1, piece2, piece3, piece4] });
      // setBoard(board);
    }
  }, [players]);

  // Handle Turn Change
  useEffect(() => {
    if (turnChange != undefined) {
      let newturn = players.filter((player) => player.id != turnChange.id)[0];
      setTurn(newturn);
    }
  }, [turnChange, players]);

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
        className={`fixed h-[70vh] lg:h-screen flex-1 overflow-hidden w-screen z-20 ${
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
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 3}
            minDistance={getMinDistance(size)}
            maxDistance={getMaxDistance(size)}
            // minDistance={50}
            // maxDistance={50}
            enablePan={false}
            enableZoom={true}
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
      </div>
      {/* <div className="fixed flex flex-col bottom-10 right-10">
        <p>Ratio: {size.width / size.height}</p>
        <p>Distance: {getMinDistance(size)}</p>
      </div> */}
    </>
  );
}
