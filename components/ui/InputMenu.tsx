import React from "react";

interface InputMenuInterface {
  visible?: boolean;
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
  visible = true,
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
  return (
    <div className="flex w-full max-w-[350px] gap-0 sm:gap-[22px]">
      <span
        onClick={() => onBack()}
        className={` top-0 material-symbols-outlined text-russianviolet hover:cursor-pointer ${
          backBtn && visible
            ? "invisible  w-0  sm:visible sm:w-auto"
            : "invisible"
        }`}
      >
        arrow_back
      </span>
      <div className="flex flex-col w-full gap-5">
        <div className="flex">
          <span
            onClick={() => onBack()}
            className={` top-0 material-symbols-outlined text-russianviolet hover:cursor-pointer sm:w-0 ${
              backBtn && visible ? "visible sm:invisible pr-2" : "invisible w-0"
            }`}
          >
            arrow_back
          </span>
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
          className={`h-[55px] px-[18px] bg-transparent outline outline-fadedrose rounded-[11px] outline-[2px] focus:outline-russianviolet focus:outline-[1.5px] placeholder-hint`}
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
      <span className="w-0 sm:w-[24px]"></span>
    </div>
  );
};
