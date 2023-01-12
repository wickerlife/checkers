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
} from "../../utils/atoms";
import { GamePiece } from "./GamePiece";
import { BaseBoard } from "./BaseBoard";
import { Move } from "../../models/Move";
import { Piece } from "../../models/Piece";
import { DumbPiece } from "./DumbPiece";
import { Position } from "../../models/Position";

/**
 * Stateful component. Retrieves Board info from state.
 * @returns JSX.Element
 */
export const GameBoard = () => {
  const board = useAtomValue(boardAtom);
  const pieceAtoms = useAtomValue(pieceAtomList);
  const [pieces, setPieces] = useAtom(piecesAtom);
  const [selected, setSelected] = useAtom(selectedAtom);
  const [paths, setPaths] = useAtom(pathsAtom);
  const [move, setMove] = useAtom(moveAtom);
  const setTurnChange = useSetAtom(turnChangeAtom);

  useEffect(() => {
    // MOVES HAPPEN HERE!
    if (move != undefined) {
      setPaths([]);
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
      setTurnChange(move.player);
    }
  }, [move, pieces]);

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
      {paths.map((path, index) => {
        const target = path.steps.at(-1)!;

        if (selected == null) {
          return;
        }

        const tpiece = new Piece({
          id: target.x * target.y,
          player: selected!.player,
          position: target,
          isdama: selected!.isdama,
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
                  player: selected.player,
                  piece: selected,
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
