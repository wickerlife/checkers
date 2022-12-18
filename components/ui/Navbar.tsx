import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="px-7 py-[12px] fixed z-50 bg-mistyrose mx-[11px] my-[11px] rounded-[11px]">
      <Link href={"/"}>
        <div className="flex justify-center space-x-[7px] align-middle hover:cursor-pointer transition ease-in-out duration-150 hover:scale-110">
          <Image src="/icon.svg" width={18} height={18} alt="Logo"></Image>
          <h1 className="font-bold text-m text-russianviolet">Mai Checkers</h1>
        </div>
      </Link>
    </div>
  );
};
