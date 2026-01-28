import { DatePickerInput, DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import { Icon } from "../Icon/Icon";
import css from "./DatePicker.module.css";
import "@mantine/dates/styles.css";
import { useCallback, useMemo } from "react";

dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

const DATE_FORMAT = "MM/DD/YYYY";

interface Props {
  value?: string | null;
  onChange?: (value: string) => void;
  name?: string;
  placeholder?: string;
  id?: string;
  error?: string | boolean;
}
export const DatePicker = ({
  name,
  id,
  placeholder,
  value,
  onChange,
  error,
}: Props) => {
  const dateValue = useMemo(() => {
    if (!value) return null;
    const date = dayjs(value, DATE_FORMAT);
    return date.isValid() ? date.toDate() : null;
  }, [value]);

  const handleChange = useCallback(
    (date: DateValue) => {
      const formattedDate = date ? dayjs(date).format(DATE_FORMAT) : "";
      onChange?.(formattedDate);
    },
    [onChange]
  );

  return (
    <DatePickerInput
      id={id}
      name={name}
      value={dateValue}
      onChange={handleChange}
      error={error}
      placeholder={placeholder || dayjs().format(DATE_FORMAT)}
      valueFormat={DATE_FORMAT}
      rightSection={<Icon id="icon-calendar" className={css.icon} />}
      rightSectionProps={{
        style: { pointerEvents: "none" },
      }}
      allowDeselect={false}
      nextIcon={<span className={css.arrow}>&#10095;</span>}
      previousIcon={<span className={css.arrow}>&#x276E;</span>}
      classNames={{
        section: css.section,
        root: css.root,
        input: css.input,
        calendarHeader: css.calendarHeader,
        calendarHeaderControl: css.headerControl,
        calendarHeaderLevel: css.calendarHeaderLevel,
        weekday: css.weekday,
        day: css.day,
        monthsListControl: css.monthsListControl,
        monthsListCell: css.monthsListCell,
        month: css.month,
        yearsListCell: css.yearsListCell,
        yearsListControl: css.yearsListControl,
      }}
      popoverProps={{
        position: "bottom-start",
        withinPortal: true,
        zIndex: 10000,
        offset: 5,
        transitionProps: { transition: "pop", duration: 250 },
        classNames: {
          dropdown: css.dropdown,
        },
      }}
    />
  );
};
