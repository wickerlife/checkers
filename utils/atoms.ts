import { atom } from "jotai";
import { splitAtom } from "jotai/utils";
import { focusAtom } from "jotai/optics";

import { Board } from "../models/Board";
import { Player } from "../models/Player";
import { Piece } from "../models/Piece";
import { optic, OpticFor } from "optics-ts";
import { selectiveyellow } from "./colors";

// Base State Atoms
export const playersConnectedAtom = atom(false);
export const playersAtom = atom<Array<Player>>([]);
export const boardAtom = atom<Board>(Board.startBoard());
export const turnAtom = atom<Player>(
  new Player("player", "Player1", selectiveyellow)
);

// Pieces List atoms
export const piecesAtom = atom((get) => get(boardAtom).pieces);
export const pieceAtomList = splitAtom(piecesAtom);

// Board Properties
export const selectedAtom = focusAtom(boardAtom, (optic) =>
  optic.prop("selected")
);
export const enabledBoardAtom = focusAtom(boardAtom, (optic) =>
  optic.prop("enabled")
);
