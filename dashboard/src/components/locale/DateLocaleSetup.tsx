"use client";

import { setDefaultOptions } from "date-fns";
import { ptBR } from "date-fns/locale";

export function DateLocaleSetup() {
  setDefaultOptions({
    locale: ptBR,
  });

  return null;
}
