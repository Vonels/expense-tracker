import { TimePicker, ConfigProvider, theme } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FormikValues, useFormikContext } from "formik";
import { useCallback, useMemo } from "react";
import css from "./AntdTimePicker.module.css";
import { Icon } from "../Icon/Icon";

interface Props {
  name: string;
  placeholder?: string;
}

dayjs.extend(customParseFormat);

export const AntdTimePicker = ({ name, placeholder }: Props) => {
  const { setFieldValue, values } = useFormikContext<FormikValues>();
  const value = values[name];

  const timeValue = useMemo(() => {
    return value && dayjs(value, "HH:mm:ss").isValid()
      ? dayjs(value, "HH:mm:ss")
      : null;
  }, [value]);

  const handleTimeChange = useCallback(
    (time: Dayjs | null) => {
      setFieldValue(name, time ? time.format("HH:mm:ss") : "");
    },
    [name, setFieldValue],
  );

  const getContainer = useCallback(
    (trigger: HTMLElement) => trigger.parentElement!,
    [],
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#0c0d0d",
          borderRadius: 8,
        },
        components: {
          DatePicker: {
            colorBgElevated: "#0ef387",
            colorText: "#0c0d0d",
            controlItemBgActive: "#0c0d0d",
            colorTextLightSolid: "#fff",
            controlItemBgHover: "rgba(0, 0, 0, 0.1)",
            colorSplit: "rgba(12, 13, 13, 0.1)",
          },
        },
      }}
    >
      <TimePicker
        className={css.antdPicker}
        classNames={{ popup: css.timePopup }}
        suffixIcon={<Icon id="icon-clock" />}
        format="HH:mm:ss"
        value={timeValue}
        onChange={handleTimeChange}
        placeholder={placeholder || "enter time"}
        showNow={false}
        allowClear={false}
        getPopupContainer={getContainer}
      />
    </ConfigProvider>
  );
};
