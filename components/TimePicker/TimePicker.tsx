"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TimePicker as MantineTimePicker } from "@mantine/dates";
import { useFormikContext, FormikValues } from "formik";
import dayjs from "dayjs";
import { Icon } from "../Icon/Icon";
import css from "./TimePicker.module.css";
import "@mantine/dates/styles.css";

interface Props {
  name: string;
  id: string;
}

export const CustomTimePicker = ({ name, id }: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsClient(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const { setFieldValue, values } = useFormikContext<FormikValues>();

  const value = useMemo(() => {
    return values[name] || undefined;
  }, [values, name]);

  const handleChange = useCallback(
    (timeString: string) => {
      setFieldValue(name, timeString);
    },
    [setFieldValue, name]
  );

  const placeholders = useMemo(() => {
    if (!isClient) return { hr: "--", min: "--", sec: "--" };
    const now = dayjs();
    return {
      hours: now.format("HH"),
      minutes: now.format("mm"),
      seconds: now.format("ss"),
    };
  }, [isClient]);

  return (
    <MantineTimePicker
      id={id}
      name={name}
      value={value}
      onChange={handleChange}
      withSeconds
      withDropdown
      hoursPlaceholder={placeholders.hours}
      minutesPlaceholder={placeholders.minutes}
      secondsPlaceholder={placeholders.seconds}
      rightSection={<Icon id="icon-clock" className={css.icon} />}
      rightSectionProps={{
        style: { pointerEvents: "none" },
      }}
      classNames={{
        root: css.root,
        input: css.input,
        section: css.section,
        field: css.field,
        dropdown: css.dropdown,
        control: css.control,
        controlsList: css.controlsList,
        controlsListGroup: css.controlsListGroup,
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
