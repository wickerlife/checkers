import React, { useEffect, useState } from "react";
import { PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  boardAtom,
  moveAtom,
  pieceAtomList,
  selectedAtom,
  pathsAtom,
  turnAtom,
  piecesAtom,
  turnChangeAtom,
  mandatoryPathsAtom,
} from "../../utils/atoms";
import { GamePiece } from "./GamePiece";
import { BaseBoard } from "./BaseBoard";
import { Move } from "../../models/Move";
import { Piece } from "../../models/Piece";
import { DumbPiece } from "./DumbPiece";
import { Position } from "../../models/Position";
import { Board } from "../../models/Board";

/**
 * Stateful component. Retrieves Board info from state.
 * @returns JSX.Element
 */
export const GameBoard = () => {
  const board = useAtomValue(boardAtom);
  const pieceAtoms = useAtomValue(pieceAtomList);
  const [pieces, setPieces] = useAtom(piecesAtom);
  const setSelected = useSetAtom(selectedAtom);
  const [paths, setPaths] = useAtom(pathsAtom);
  const [mandatoryPaths, setMandatoryPaths] = useAtom(mandatoryPathsAtom);
  const [move, setMove] = useAtom(moveAtom);
  const [turnChange, setTurnChange] = useAtom(turnChangeAtom);

  useEffect(() => {
    // MOVES HAPPEN HERE!
    if (move != undefined) {
      setPaths([]);
      setMandatoryPaths([]);
      let temp = new Piece({
        id: move.piece.id,
        player: move.player,
        position: move.position,
        isdama:
          move.piece.isdama ||
          Position.isEnemySide(move.position, move.player.id),
      });
      let eaten = move.path.getEaten(board).map((piece) => piece.id);
      let filtered = pieces.filter(
        (piece) => !eaten.includes(piece.id) && piece.id != move.piece.id
      );
      filtered.push(temp);
      setPieces(filtered);
      setMove(undefined);

      setTurnChange(move.player); //  This will signal the Game component to process the turn change and eventually end the game or impose a mandatory move
    }
  }, [move, pieces, paths, turnChange]);

  return board ? (
    <group>
      {/* Board sides and tiles */}
      <BaseBoard></BaseBoard>

      {/* Board pieces */}
      {pieceAtoms.map((pieceAtom, index) => {
        return (
          <GamePiece
            pieceAtom={pieceAtom as PrimitiveAtom<Piece | undefined>}
            key={index}
          />
        );
      })}

      {/* Targets */}
      {[...paths, ...mandatoryPaths].map((path, index) => {
        const target = path.steps.at(-1)!;
        const origin = Board.getPiece(board, path.steps[0])!;

        if (origin == undefined) {
          return;
        }

        const tpiece = new Piece({
          id: target.x * target.y,
          player: origin.player,
          position: target,
          isdama: origin.isdama,
        });

        return (
          <DumbPiece
            key={`${index}:${path.steps.length}:${path.steps.at(-1)!.x}:${
              path.steps.at(-1)!.y
            }`}
            trasparent={true}
            piece={tpiece}
            enabled={true}
            onSelect={() => {
              setMove(
                new Move({
                  player: origin.player,
                  piece: origin,
                  position: target,
                  path: path,
                })
              );
              setSelected(null);
            }}
          />
        );
      })}
    </group>
  ) : null;
};
