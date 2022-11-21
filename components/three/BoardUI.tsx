import React from "react";
import { Euler, Vector3 } from "three";
import { PieceUI } from "./PieceUI";

const commonMaterialProps = {
  metalness: 0,
  roughness: 0.8,
  opacity: 1,
  transparent: true,
};

const edgeOffset = 4.25;
const edgeDefaultLength = 8;
const edgeDefaultHeight = 0.2;
const edgeDefaultWidth = 0.5;

import { Board } from "../../models/Board";
import {
  mistyrose,
  russianviolet,
  selectiveyellow,
  vividtangerine,
} from "../../utils/colors";
import { boardAtom, pieceAtomList } from "../../utils/atoms";
import { useAtom, useAtomValue } from "jotai";

/**
 * Stateful component
 * @param param0
 * @returns JSX.Element
 */
export const BoardUI = () => {
  const [board, setBoard] = useAtom(boardAtom);
  const [pieceAtoms] = useAtom(pieceAtomList);

  return board ? (
    <group>
      {/* Board sides */}
      {[0, 1, 2, 3].map((index) => {
        // Box Position
        let position = [] as any;

        // Box Rotation
        let rotation = new Euler(0, 0, 0);

        // Box Size
        let args = [edgeDefaultLength, edgeDefaultHeight, edgeDefaultWidth];

        switch (index) {
          // The first 2 edges are 1 unit longer.
          case 0:
            position = [0, 0, -edgeOffset];
            args[0] += 1;
            break;
          case 1:
            position = [0, 0, edgeOffset];
            args[0] += 1;
            break;
          case 2:
            position = [-edgeOffset, 0, 0];
            rotation = new Euler(0, Math.PI / 2, 0);
            break;
          case 3:
            position = [edgeOffset, 0, 0];
            rotation = new Euler(0, Math.PI / 2, 0);
            break;

          default:
        }

        return (
          // Board sides
          <mesh
            castShadow
            receiveShadow
            key={index}
            position={position}
            rotation={rotation}
          >
            <boxBufferGeometry args={args} />
            <meshStandardMaterial
              {...commonMaterialProps}
              color={vividtangerine}
              transparent={false}
              opacity={1}
            />
          </mesh>
        );
      })}

      {/* Board tiles */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((x) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((y) => {
          return (
            <group key={x * 8 + y}>
              <mesh
                position={[x - 3.5, 0, y - 3.5]}
                scale={[1, 0.2, 1]}
                receiveShadow
                //onClick={() => possible && moveToWrapper([j, i])}
              >
                <boxBufferGeometry />
                <meshStandardMaterial
                  {...((x + y) % 2 === 0
                    ? {
                        color: mistyrose,
                      }
                    : {
                        color: russianviolet,
                      })}
                  {...commonMaterialProps}
                />
              </mesh>
            </group>
          );
        })
      )}

      {/* Board pieces */}
      {pieceAtoms.map((pieceAtom) => {
        const piece = useAtomValue(pieceAtom);

        return (
          <PieceUI
            scale={new Vector3(0.25, 0.1, 0.25)}
            color={piece.color}
            position={
              new Vector3(piece.position.x - 3.5, 0.1, piece.position.y - 3.5)
            }
          />
        );
      })}
    </group>
  ) : null;
};
