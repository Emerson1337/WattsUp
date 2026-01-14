"use client";

import * as React from "react";
import { parseDate } from "chrono-node";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  title?: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  description?: string;
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function DatePicker({
  title,
  date,
  onDateChange,
  disabled = false,
  placeholder = "Amanhã ou próxima semana",
  description,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [month, setMonth] = React.useState<Date | undefined>(date);

  React.useEffect(() => {
    if (date) {
      setValue(formatDate(date));
      setMonth(date);
    }
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    const parsedDate = parseDate(e.target.value);
    if (parsedDate) {
      onDateChange(parsedDate);
      setMonth(parsedDate);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    setValue(formatDate(selectedDate));
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {title && (
        <Label htmlFor="date" className="px-1">
          {title}
        </Label>
      )}
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          className="bg-background pr-10"
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              disabled={disabled}
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Selecionar data</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      {description && (
        <div className="text-muted-foreground px-1 text-sm">{description}</div>
      )}
    </div>
  );
}
