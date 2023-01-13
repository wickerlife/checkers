import { useAtomValue } from "jotai";
import React from "react";
import { turnAtom } from "../../utils/atoms";

export const TurnWidget = () => {
  const turn = useAtomValue(turnAtom);

  return (
    <p className="text-gray-500 align-middle dark:text-gray-400">
      <div className=" flex align-middle justify-center items-center gap-[11px] px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
        <div className={`w-[22px] h-[22px] rounded-full inline-block`}></div>
      </div>{" "}
    </p>
  );
};
