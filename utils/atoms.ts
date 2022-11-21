import { atom } from "jotai";
import { splitAtom } from "jotai/utils";
import { focusAtom } from "jotai/optics";

import { Board } from "../models/Board";
import { Player } from "../models/Player";
import { Piece } from "../models/Piece";
import { OpticFor } from "optics-ts";
import { selectiveyellow } from "./colors";

// Base State Atoms
export const playersConnectedAtom = atom(false);
export const playersAtom = atom<Array<Player>>([]);
export const boardAtom = atom<Board>(Board.randomBoard());
export const turnAtom = atom<Player>(
  new Player("player", "Player1", selectiveyellow)
);

// Pieces List atoms
const piecesAtom = atom((get) => get(boardAtom).pieces);
export const pieceAtomList = splitAtom(piecesAtom);
