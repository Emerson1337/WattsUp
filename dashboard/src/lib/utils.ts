import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function convertToBRDecimal(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const OneMinuteConsumptionMock = (): { consumption: number }[] => {
  const dataMock = [];

  for (let index = 0; index < 60; index++) {
    dataMock.push({
      consumption: 0,
    });
  }

  return dataMock;
};
