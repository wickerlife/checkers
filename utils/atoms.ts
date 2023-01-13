import { atom } from "jotai";
import { splitAtom } from "jotai/utils";
import { focusAtom } from "jotai/optics";

import { Board } from "../models/Board";
import { Player } from "../models/Player";
import { selectiveyellow } from "./colors";
import { Piece } from "../models/Piece";
import { Move } from "../models/Move";

export enum GameState {
  PlayerRegistration,
  GameStarted,
  GameEnded,
}

// Base State Atoms
export const playersConnectedAtom = atom(false);
export const playersAtom = atom<Array<Player>>([]);
export const gameStateAtom = atom<GameState>(GameState.PlayerRegistration);
export const boardAtom = atom<Board>(Board.randomBoard());
export const turnChangeAtom = atom<Player | undefined>(undefined);
export const turnAtom = atom<Player>(
  new Player({ id: 1, username: "Player1", color: selectiveyellow })
);
export const moveAtom = atom<Move | undefined>(undefined);

// Pieces List atoms
export const piecesAtom = atom(
  (get) => get(boardAtom).pieces,
  (get, set, pieces: Array<Piece | undefined>) => {
    let board = get(boardAtom);
    let cleaned = [] as Array<Piece>;
    pieces.forEach((piece) => {
      if (piece != undefined) cleaned.push(piece);
    });
    board.pieces = cleaned;
    set(boardAtom, board);
    // you can set as many atoms as you want at the same time
  }
);
export const pieceAtomList = splitAtom(piecesAtom);
//export const pieceAtom = atom((get) => get(boardAtom).pieces.find(x));

// Board Properties
export const selectedAtom = focusAtom(boardAtom, (optic) =>
  optic.prop("selected")
);
export const enabledBoardAtom = focusAtom(boardAtom, (optic) =>
  optic.prop("enabled")
);
export const pathsAtom = focusAtom(boardAtom, (optic) => optic.prop("paths"));
