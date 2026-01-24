import { DatePicker, ConfigProvider, theme } from "antd";
import dayjs, { Dayjs } from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import { FormikValues, useFormikContext } from "formik";
import css from "./DatePicker.module.css";
import { ReactNode, useCallback, useMemo } from "react";
import { Icon } from "../Icon/Icon";

interface Props {
  name: string;
  placeholder?: string;
}

dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  weekStart: 1,
});

export const AntdDatePicker = ({ name, placeholder }: Props) => {
  const { setFieldValue, values } = useFormikContext<FormikValues>();

  const dateValue = useMemo(() => {
    const rawValue = values[name];
    return rawValue ? dayjs(rawValue, "MM/DD/YYYY") : null;
  }, [values, name]);

  const handleDateChange = useCallback(
    (date: Dayjs | null) => {
      setFieldValue(name, date ? date.format("MM/DD/YYYY") : "");
    },
    [name, setFieldValue]
  );

  const getContainer = useCallback((trigger: HTMLElement) => {
    return trigger.parentElement!;
  }, []);

  const renderPanel = useCallback(
    (panelNode: ReactNode) => (
      <div className={css.autoHeightWrapper}>{panelNode}</div>
    ),
    []
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#0c0d0d",
          colorTextPlaceholder: "#fff",
        },
        components: {
          DatePicker: {
            colorBgElevated: "#0ef387",
            colorText: "#0c0d0d",
            colorTextHeading: "#0c0d0d",
            fontWeightStrong: 400,
            controlItemBgActive: "#0c0d0d",
            colorTextLightSolid: "#fff",
            controlItemBgHover: "rgba(0, 0, 0, 0.4)",
            fontFamily: "Inter, sans-serif",
          },
        },
      }}
    >
      <DatePicker
        className={css.antdPicker}
        classNames={{
          popup: css.calendarPopup,
        }}
        suffixIcon={<Icon id="icon-calendar" />}
        format="MM/DD/YYYY"
        value={dateValue?.isValid() ? dateValue : null}
        onChange={handleDateChange}
        placeholder={placeholder || dayjs().format("MM/DD/YYYY")}
        allowClear={false}
        showNow={false}
        superNextIcon={null}
        superPrevIcon={null}
        getPopupContainer={getContainer}
        panelRender={renderPanel}
      />
    </ConfigProvider>
  );
};
