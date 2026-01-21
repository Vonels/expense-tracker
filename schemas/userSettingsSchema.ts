import * as Yup from "yup";

const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const FILE_SIZE = 2 * 1024 * 1024;

export const userSettingsSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Ім’я має бути не коротше 2 символів")
    .max(20, "Ім’я має бути не довше 20 символів")
    .required("Це поле обов’язкове"),

  currency: Yup.string()
    .oneOf(["uah", "usd", "eur"], "Некоректна валюта")
    .required("Оберіть валюту"),

  avatar: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "Файл занадто великий (макс. 2MB)",
      (value) => !value || (value instanceof File && value.size <= FILE_SIZE),
    )
    .test(
      "fileFormat",
      "Ніпідтримуваний формат файлу",
      (value) =>
        !value ||
        (value instanceof File && SUPPORTED_FORMATS.includes(value.type)),
    ),
});
