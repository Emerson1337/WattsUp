"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";
import Logo from "@/assets/logo.svg";

export default function Navbar() {
  return (
    <header className="sticky max-lg:py-4 mb-4 lg:mb-10 lg:flex-col justify-end lg:pt-10 top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-10">
      <div className="flex gap-3 items-center max-lg:w-full">
        <Logo className="text-primary size-6 lg:size-16" />
        <h1 className="font-bold text-lg lg:text-4xl">
          Watts<span className="text-primary">Up</span>
        </h1>
      </div>
      <Image
        src={"https://github.com/emerson1337.png"}
        priority
        width={250}
        height={250}
        alt="Avatar"
        className="overflow-hidden w-10 lg:w-64 rounded-full"
      />
      <ThemeToggle />
    </header>
  );
}
