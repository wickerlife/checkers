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
      className="bg-mistyrose hover:cursor-pointer rounded-[22px] hover:scale-105 transition ease-in-out duration-100 grid grid-cols-2 px-[22px] py-[22px] gap-3 max-w-[500px] md:grid-cols-1 md:max-w-[350px] lg:max-w-[400px] lg:p-[33px]"
      onClick={onClick}
    >
      <div className="">
        <p className="font-normal text-nypink text-[14px]">{subtitle}</p>
        <h2 className="font-semibold text-[20px] lg:text-[24px]">{heading}</h2>
      </div>
      <div className="max-h-[150px] h-auto row-span-2 md:row-span-1 lg:h-[200px] lg:max-h-[200px]">
        {children}
      </div>
      <div className="text-[14px]">{text}</div>
    </div>
  );
};
