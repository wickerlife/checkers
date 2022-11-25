import React from "react";

interface GameModeInterface {
  subtitle: string;
  heading: string;
  text: string;
  onClick: any;
  children: any;
}

export const GameMode = ({
  subtitle,
  heading,
  text,
  onClick,
  children,
}: GameModeInterface) => {
  return (
    <div
      className="bg-mistyrose w-[400px] h-[500px] hover:cursor-pointer rounded-[22px] flex flex-col place-content-center  justify-between items-center hover:scale-105 transition ease-in-out duration-100  px-[44px] pt-[44px] pb-[77px]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <p className="text-[14px]">{subtitle}</p>
        <h2 className="text-[24px] font-semibold text-russianviolet">
          {heading}
        </h2>
      </div>
      <div className="h-[200px]">{children}</div>
      <div className="text-center">{text}</div>
    </div>
  );
};
