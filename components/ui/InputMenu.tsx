import { useAtom } from "jotai";
import React, { useState } from "react";
import { playersAtom } from "../../utils/atoms";

interface InputMenuInterface {
  value?: string;
  label: string;
  inputHint: string;
  btnText: string;
  backBtn: boolean;
  backBtnEnabled: boolean;
  onSubmit: any;
  onChange: any;
  onBack?: any;
}

export const InputMenu = ({
  value = "",
  label,
  inputHint,
  btnText,
  backBtn,
  backBtnEnabled = false,
  onSubmit,
  onChange,
  onBack,
}: InputMenuInterface) => {
  const [players, setPlayers] = useAtom(playersAtom);

  return (
    <div className="flex gap-[22px]">
      <span
        onClick={() => onBack()}
        className={` top-0 material-symbols-outlined text-russianviolet hover:cursor-pointer ${
          backBtn ? "visible" : "invisible"
        }`}
      >
        arrow_back
      </span>
      <div className="flex flex-col gap-5 min-w-[350px] ">
        <div>
          <label htmlFor="input" className=" text-russianviolet">
            {label}
          </label>
        </div>

        <input
          onChange={(e) => {
            onChange(e);
          }}
          type="text"
          placeholder={inputHint}
          className={`h-[55px] px-[18px] bg-transparent outline  outline- outline-fadedrose rounded-[11px] outline-[2px] focus:outline-russianviolet focus:outline-[1.5px] placeholder-hint`}
          value={value}
        />
        <button
          disabled={!backBtnEnabled}
          className={`h-[55px] ${
            backBtnEnabled
              ? "bg-russianviolet text-mistyrose"
              : "bg-fadedrose text-hint"
          } rounded-[11px] transition ease-in-out hover:scale-105 `}
          onSubmit={() => onSubmit()}
          onClick={() => onSubmit()}
        >
          {btnText}
        </button>
      </div>
      <span className="w-[24px]"></span>
    </div>
  );
};
