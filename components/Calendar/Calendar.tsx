"use client";

import { DayPicker } from "react-day-picker";
import { useState, useRef } from "react";
import { format } from "date-fns";
import { Icon } from "../Icon/Icon";
import css from "./Calendar.module.css";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <div className={css.wrapper}>
      {/* INPUT */}
      <div className={css.inputWrapper}>
        <label htmlFor="calendar-input">
          <Icon id="icon-calendar" className={css.icon} />
        </label>
        <input
          id="calendar-input"
          type="text"
          readOnly
          value={date ? format(date, "dd/MM/yyyy") : ""}
          placeholder="dd/mm/yyyy"
          className={css.input}
          onClick={handleClick}
        />
        {/* CALENDAR */}
        {open && (
          <div className={css.popover}>
            <DayPicker
              mode="single"
              showOutsideDays
              selected={date}
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
    </div>
  );
};

export default Calendar;
