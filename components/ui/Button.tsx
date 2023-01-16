import { useAtomValue } from "jotai";
import React from "react";
import { Player } from "../../models/Player";
import { turnAtom } from "../../utils/atoms";

interface ButtonInterface {
  player: Player;
  active?: boolean;
}

export const Button = ({ player, active = false }: ButtonInterface) => {
  return (
    <div
      key={player.id}
      className="text-gray-500 align-middle dark:text-gray-400"
    >
      <div
        className={
          "flex align-middle justify-center items-center gap-[11px] px-4 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg min-w-[77px]" +
          ` ${active ? "border-russianviolet" : ""}`
        }
      >
        <div
          className={`w-[22px] h-[22px] rounded-full flex justify-center items-center`}
          style={{ backgroundColor: player.color }}
        >
          {player.wins}
        </div>
        {`${player.username}`}
      </div>
    </div>
  );
};
