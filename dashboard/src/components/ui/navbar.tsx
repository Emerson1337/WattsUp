"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import Image from "next/image";
import Logo from "@/assets/logo.svg";
import { useDataLayer } from "@/components/context/DataLayerContext";
import { updateTariff as updateTariffApi } from "@/services/api";
import { useState, useEffect } from "react";

const AVATAR_URL = "https://github.com/emerson1337.png";
const AVATAR_SIZE = 250;

export default function Navbar() {
  const { state, dispatch } = useDataLayer();
  const { tariff, tariffIsLoading } = state;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!tariff?.nextReadingDate) return;

    const date = new Date(tariff.nextReadingDate);
    setSelectedDate(date);
    setHasChanges(false);
  }, [tariff]);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);

    if (!tariff || !date) {
      setHasChanges(false);
      return;
    }

    const currentNextReadingDate = new Date(tariff.nextReadingDate);
    const hasChanged = date.getTime() !== currentNextReadingDate.getTime();

    setHasChanges(hasChanged);
  };

  const handleSave = async () => {
    if (!tariff || !selectedDate) return;

    setIsSaving(true);
    try {
      const updatedTariff = await updateTariffApi(tariff.id, {
        nextReadingDate: selectedDate,
      });

      if (!updatedTariff) {
        throw new Error("Falha ao atualizar tarifa");
      }

      dispatch({ type: "SET_TARIFF", payload: updatedTariff });
      setHasChanges(false);
    } catch (error) {
      console.error("Erro ao salvar data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="sticky max-lg:py-4 mb-4 lg:mb-10 lg:flex-col justify-end lg:pt-10 top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-10">
      <div className="flex gap-3 items-center max-lg:w-full">
        <Logo className="text-primary size-6 lg:size-16" />
        <h1 className="font-bold text-lg lg:text-4xl">
          Watts<span className="text-primary">Up</span>
        </h1>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="max-w-72">
          <DatePicker
            title="Data da próxima leitura prevista"
            description="Confirme a data da próxima leitura prevista para o seu consumo na sua conta de energia elétrica."
            date={selectedDate}
            onDateChange={handleDateChange}
            disabled={tariffIsLoading || !tariff}
          />
        </div>
        {hasChanges && (
          <Button onClick={handleSave} disabled={isSaving || tariffIsLoading}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        )}
      </div>

      <Image
        src={AVATAR_URL}
        priority
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        alt="Avatar"
        className="overflow-hidden w-10 lg:w-64 rounded-full"
        unoptimized
      />
      <ThemeToggle />
    </header>
  );
}
