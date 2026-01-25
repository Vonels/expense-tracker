import { DatePickerInput, DateValue } from "@mantine/dates";
import { useFormikContext, FormikValues } from "formik";
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
  name: string;
  placeholder?: string;
}

export const DatePicker = ({ name, placeholder }: Props) => {
  const { setFieldValue, values } = useFormikContext<FormikValues>();

  const value = useMemo(() => {
    const rawValue = values[name];
    if (!rawValue) return null;
    const date = dayjs(rawValue, DATE_FORMAT);
    return date.isValid() ? date.toDate() : null;
  }, [values, name]);

  const handleChange = useCallback(
    (date: DateValue) => {
      const formattedDate = date ? dayjs(date).format(DATE_FORMAT) : "";
      setFieldValue(name, formattedDate);
    },
    [setFieldValue, name]
  );

  return (
    <DatePickerInput
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder || dayjs().format(DATE_FORMAT)}
      valueFormat={DATE_FORMAT}
      rightSection={<Icon id="icon-calendar" className={css.icon} />}
      rightSectionProps={{ style: { pointerEvents: "none" } }}
      allowDeselect={false}
      nextIcon={<span className={css.arrow}>&#10095;</span>}
      previousIcon={<span className={css.arrow}>&#x276E;</span>}
      classNames={{
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
        offset: 5,
        transitionProps: { transition: "pop", duration: 250 },
        classNames: {
          dropdown: css.dropdown,
        },
      }}
    />
  );
};
