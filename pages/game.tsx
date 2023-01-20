import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Outline,
  SelectiveBloom,
  Selection,
  DepthOfField,
} from "@react-three/postprocessing";
import { useAtom, useSetAtom } from "jotai";
import Head from "next/head";
import { useRouter } from "next/router";
import { Ref, Suspense, useEffect, useRef, useState } from "react";
import React from "react-dom";
import { DirectionalLight } from "three";
import { GameBoard } from "../components/three/GameBoard";
import { Light } from "../components/three/Light";
import { Button } from "../components/ui/Button";
import { InputMenu } from "../components/ui/InputMenu";
import { useKeyPress, useCurrentSize, Size } from "../hooks/hooks";
import { Board } from "../models/Board";
import { Piece } from "../models/Piece";
import { Player } from "../models/Player";
import { Position } from "../models/Position";
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
  mandatoryPathsAtom,
  boardEnabledAtom,
} from "../utils/atoms";
import { nypink, selectiveyellow } from "../utils/colors";

/**
 * Multiplayer, One-Device Game Mode
 * @returns {JSX.Element} Game component
 */
export default function Game() {
  const router = useRouter(); // React Router
  const lightRef = useRef() as Ref<DirectionalLight>; // Used for EffectComposer lights and effects
  const size = useCurrentSize();

  // Local state
  const [playerName, setPlayerName] = useState("");
  const [pressedEnter, setPressedEnter] = useState(false);
  const [pressedEscape, setPressedEscape] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [winner, setWinner] = useState<Player | undefined>(undefined);
  const setBoardEnabled = useSetAtom(boardEnabledAtom);
  const [showHint, setShowHint] = useState(false);

  // Global state
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [selected, setSelected] = useAtom(selectedAtom);
  const setPaths = useSetAtom(pathsAtom);
  const [mandatoryPaths, setMandatoryPaths] = useAtom(mandatoryPathsAtom);
  const [players, setPlayers] = useAtom(playersAtom);
  const [board, setBoard] = useAtom(boardAtom);
  const [turn, setTurn] = useAtom(turnAtom);
  const [turnChange, setTurnChange] = useAtom(turnChangeAtom);
  const setMove = useSetAtom(moveAtom);

  /**
   * Function returns the initial Board state for the game.
   * @returns {Board} An instance of Board
   */
  const generateInitialBoard = () => {
    return Board.startBoard(players.sort((a, b) => a.id - b.id));
    // CODE BELOW IS FOR DEV PURPOSES
    // return new Board({
    //   pieces: [
    //     new Piece({
    //       id: 1,
    //       player: players[1],
    //       position: new Position(3, 4),
    //     }),
    //     new Piece({
    //       id: 2,
    //       player: players[0],
    //       position: new Position(5, 6),
    //     }),
    //   ],
    // });
  };

  interface ResetGameInterface {
    resetPlayers?: boolean;
    winner?: Player;
  }

  /**
   * Resets the game state.
   *
   * If [resetPlayers] = true, then player state will be reset.
   * Else, the player state will be mantained (new game for the same players)
   *  The turn state will be changed to the winning player.
   * @param {boolean} resetPlayers Whether to reset the Players state
   * @param {Player} winner The winner Player instance
   */
  const resetGame = ({ resetPlayers, winner }: ResetGameInterface) => {
    setPaths([]);
    setMandatoryPaths([]);
    setBoard(generateInitialBoard());
    setMove(undefined);
    setTurnChange(undefined);
    setSelected(null);
    setBoardEnabled(true);
    setOverlay(false);
    setWinner(undefined);

    if (resetPlayers) {
      setPlayers([]);
      setGameState(GameState.PlayerRegistration);
    } else {
      setGameState(GameState.GameStarted);
      // invert players
      setTurn(winner!);
    }
  };

  /**
   * Registers a player into the state using the input value.
   *
   * @param {string} value Input value for the name of the Player.
   * @param {Array<Player>} players Array of players already in state.
   */
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

    setPlayers([...players, player]);
  };

  /**
   * Removes the last index player from the state
   *
   * @param {Array<Player>} players Current state of players
   */
  const removePlayer = (players: any) => {
    let temp = players;
    let prev = temp.shift();
    setPlayers(temp);
    if (prev) setPlayerName(prev.username);
  };

  /**
   * Calculates minimum camera distance from Three.js object in
   *  the scene.
   *
   * @param {Size} size Current window size.
   * @returns {number} Minimum distance calculated
   */
  const getMinDistance = (size: Size) => {
    let ratio = size.width / size.height;

    if (size.width < 850) return 35 / ratio;
    else return 60 / ratio;
  };

  /**
   * Called once on page load.
   * Prefetches the index page for faster routing
   */
  useEffect(() => {
    router.prefetch("/");
  }, []);

  /**
   * When player state is updated, initialize the GameBoard with the correct
   *  Board state.
   */
  useEffect(() => {
    if (players.length > 1 && gameState == GameState.PlayerRegistration) {
      setBoard(generateInitialBoard());
      setGameState(GameState.GameStarted);
    }
  }, [players, gameState]);

  // Handle Game State Change
  useEffect(() => {
    if (gameState == GameState.GameEnded) {
      setPaths([]);
      setMandatoryPaths([]);
      setMove(undefined);
      setSelected(null);
      setTurn(undefined);
      setTurnChange(undefined);
      setBoardEnabled(false);
      setOverlay(true);
    }
  }, [gameState]);

  // HANDLE TURN CHANGE
  useEffect(() => {
    if (turnChange != undefined) {
      let newturn = players.filter((player) => player.id != turnChange.id)[0];
      // Detect end Game
      if (Board.getPlayerPieces(board, newturn).length == 0) {
        // GAME ENDED!
        // Set winner
        turnChange.addWin();
        setWinner(turnChange);
        setPlayers([newturn, turnChange].sort((a, b) => a.id - b.id));
        setGameState(GameState.GameEnded);
      } else {
        // Detect mandatory Move
        let mandatory = Board.mandatoryPaths(board, newturn);
        if (mandatory.length > 0 && mandatoryPaths.length == 0) {
          // Suggest mandatory path
          setMandatoryPaths(mandatory);
        }

        // Change turn normally
        setTurn(newturn);
      }
    }
  }, [turnChange, players, board, mandatoryPaths]);

  // Listen to ENTER keypress
  useEffect(() => {
    if (!pressedEnter) return;

    if (players.length < 2) {
      // Presing Enter will move to next player input or to game
      if (playerName.length > 2) addPlayer(playerName, players);
    }

    if (gameState == GameState.GameEnded && overlay) {
      // Pressing Enter will Close the Overlay
      setOverlay(false);
    } else if (gameState == GameState.GameEnded && !overlay && winner) {
      resetGame({
        resetPlayers: false,
        winner: winner,
      });
    }

    setPressedEnter(false);
  }, [pressedEnter, players, playerName, gameState, overlay, winner]);

  // Listen to ESCAPE (esc) keypress
  useEffect(() => {
    if (!pressedEscape) return;

    if (players.length == 1) {
      removePlayer(players);
    } else if (players.length < 1) {
      router.back();
    } else if (gameState == GameState.GameEnded && !overlay) {
      router.push("/");
      resetGame({ resetPlayers: true });
    } else {
      // Open Options Menu -> Not implemented
    }

    setPressedEscape(false);
  }, [pressedEscape, players, gameState, overlay]);

  // Register kepress listeners
  useKeyPress(() => setPressedEnter(true), "Enter");
  useKeyPress(() => setPressedEscape(true), "Escape");

  /**
   * Prevent Page-Refresh so that game state is not accidentally lost
   */
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
    <>
      <Head>
        <title>
          {gameState == GameState.PlayerRegistration
            ? "Register Players"
            : "Mai Checkers: Game"}
        </title>
      </Head>
      <div
        className={` overflow-hidden  ${
          players.length < 2 ? "" : "absolute top-[50%] translate-y-[-45%] "
        }`}
      >
        <div className="flex flex-col overflow-hidden">
          {/* Player name selection -- only visible when submiting player names */}
          <div
            className={` px-4 ${
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
        className={`fixed h-screen flex-1 overflow-hidden w-screen z-10 ${
          players.length == 2 ? "visible" : "invisible h-0 w-0"
        }`}
      >
        {/* Winning Overlay */}
        <div
          className={`fixed z-40 w-screen h-screen  flex flex-col gap-11 items-center justify-center ${
            overlay ? "visible" : "invisible"
          }`}
          onClick={() => setOverlay(false)}
        >
          <h1
            className="text-[44px] font-bold z-40"
            style={{ color: winner?.color }}
          >
            {winner?.username} won the game!
          </h1>
          <p className="z-40 text-gray-300 align-middle">
            Press{" "}
            <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              Enter
            </kbd>{" "}
            to continue...
          </p>

          <div className="fixed z-30 w-screen h-screen opacity-70 bg-russianviolet"></div>
        </div>

        {/* Player Stats */}
        <div className="fixed z-30 flex justify-center w-screen gap-4 top-24 sm:top-12">
          {players.map((player) => {
            return Button({ player: player, active: player.id == turn?.id });
          })}

          <div
            className={`"text-gray-500 align-middle dark:text-gray-400" ${
              gameState == GameState.GameEnded && !overlay ? "" : "invisible"
            }`}
          ></div>
        </div>

        {/* Canvas and Board */}
        <Suspense>
          <Canvas
            dpr={1.8} // resolution
            frameloop="demand"
            shadows
            camera={{ position: [0, 20, 20], zoom: 5 }}
            gl={{ preserveDrawingBuffer: true }}
            onPointerMissed={() => {
              if (gameState != GameState.GameEnded) {
                setSelected(null);
                setPaths([]);
                setMove(undefined);
              }
            }}
          >
            <Light lightRef={lightRef}></Light>
            {/* Orbit controls allows the user to rotate the visual horizontally */}
            <OrbitControls
              maxAzimuthAngle={0}
              minAzimuthAngle={-Math.PI}
              minPolarAngle={size.width < 650 ? Math.PI / 9 : Math.PI / 4}
              maxPolarAngle={size.width < 650 ? Math.PI / 9 : Math.PI / 3}
              minDistance={getMinDistance(size)}
              maxDistance={getMinDistance(size)}
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
                  <DepthOfField
                    focusDistance={0}
                    focalLength={0.02}
                    bokehScale={overlay ? 10 : 0}
                  ></DepthOfField>
                </EffectComposer>
              </Suspense>
            </Selection>
          </Canvas>
        </Suspense>

        {/* End Game Menu */}
        <div
          className={`fixed flex bottom-24 sm:bottom-12 place-content-center w-screen z-30 gap-4 ${
            gameState == GameState.GameEnded && !overlay ? "" : "invisible"
          }`}
        >
          <div
            className={`"text-gray-500 align-middle dark:text-gray-400 cursor-pointer"`}
            onClick={() => setPressedEscape(true)}
          >
            <div className="cursor-pointer hover:scale-105 flex align-middle justify-center items-center gap-[11px] px-4 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500 min-w-[77px] h-full">
              <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                Esc
              </kbd>{" "}
              {`Home`}
            </div>
          </div>
          <div
            className={`"text-gray-500 align-middle dark:text-gray-400 cursor-pointer "`}
            onClick={() => setPressedEnter(true)}
          >
            <div className="hover:scale-105 flex align-middle justify-center items-center gap-[11px] px-4 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500 min-w-[77px] h-full">
              <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                Enter
              </kbd>{" "}
              {`Play Again`}
            </div>
          </div>
        </div>

        {/* Overlay message: Press a piece to start */}
        <div
          className={` z-30 fixed flex w-full justify-center bottom-24 sm:bottom-12 ${
            gameState != GameState.GameStarted || selected != null
              ? "invisible"
              : ""
          }`}
        >
          <p
            className={
              `${
                mandatoryPaths.length > 0 ? "text-gray-800" : "text-gray-500"
              }` + " align-middle"
            }
          >
            {mandatoryPaths.length > 0 ? (
              <p>
                <b>{turn?.username}</b>, you must make a <b>mandatory move</b>
                ...
              </p>
            ) : (
              <p>
                <b>{turn?.username}</b>, click on a piece to select it...
              </p>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
