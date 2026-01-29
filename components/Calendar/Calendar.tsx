"use client";

import { DayPicker } from "react-day-picker";
import { useState, useRef, useEffect } from "react";
import { format, parse, isValid } from "date-fns";
import { Icon } from "../Icon/Icon";
import css from "./Calendar.module.css";

interface CalendarProps {
  onDateSelect?: (date: Date | undefined) => void;
}

const Calendar = ({ onDateSelect }: CalendarProps) => {
  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    setOpen(true);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setInputValue(selectedDate ? format(selectedDate, "dd/MM/yyyy") : "");
    setOpen(false);
    if (onDateSelect) {
      onDateSelect(selectedDate);
    }
  };

  const formatDateInput = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 8);

    const day = numbersOnly.slice(0, 2);
    const month = numbersOnly.slice(2, 4);
    const year = numbersOnly.slice(4, 8);

    if (numbersOnly.length <= 2) return day;
    if (numbersOnly.length <= 4) return `${day}/${month}`;
    return `${day}/${month}/${year}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDateInput(e.target.value);
    setInputValue(formattedValue);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const parsedDate = parse(inputValue, "dd/MM/yyyy", new Date());

      if (isValid(parsedDate)) {
        handleDateSelect(parsedDate);
      } else {
        setInputValue("");
      }
    }
  };

  const handleClearDate = () => {
    setDate(undefined);
    setInputValue("");
    setOpen(false);
    if (onDateSelect) {
      onDateSelect(undefined);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open]);

  return (
    <>
      {/* INPUT */}
      <div className={css.inputWrapper} ref={wrapperRef}>
        <label htmlFor="calendar-input">
          <Icon id="icon-calendar" className={css.icon} />
        </label>
        <input
          ref={inputRef}
          id="calendar-input"
          type="text"
          value={inputValue}
          placeholder="dd/mm/yyyy"
          className={css.input}
          onClick={handleClick}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
        {date && (
          <button
            type="button"
            onClick={handleClearDate}
            className={css.clearBtn}
            title="Очистить дату"
          >
            ✕
          </button>
        )}
        {/* CALENDAR */}
        {open && (
          <div className={css.popover}>
            <DayPicker
              mode="single"
              showOutsideDays
              selected={date}
              onDayClick={handleDateSelect}
              classNames={{
                month_caption: css.monthCaption,
                button_next: css.button_next,
                button_previous: css.button_previous,
                chevron: css.chevron,
                month_grid: css.monthGrid,
                weekday: css.weekday,
                outside: css.outside,
                today: css.today,
                day_button: css.dayButton,
                day: css.day,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Calendar;
