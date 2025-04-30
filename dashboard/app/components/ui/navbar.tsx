"use client";

import { Tooltip } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Navbar() {
  return (
    <header className="sticky flex-col justify-end pt-10 top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-10">
      <img
        src={"https://github.com/emerson1337.png"}
        width={250}
        height={250}
        alt="Avatar"
        className="overflow-hidden rounded-full"
      />
      <Tooltip>
        <ThemeToggle />
      </Tooltip>
    </header>
  );
}
