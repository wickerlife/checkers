import React from "react";
import { Euler } from "three";
import { Position } from "../../models/Position";
import { mistyrose, russianviolet, vividtangerine } from "../../utils/colors";

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

export const BaseBoard = () => {
  return (
    <group>
      {/* Board sides and tiles */}
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
    </group>
  );
};
