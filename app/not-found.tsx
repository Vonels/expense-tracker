import css from "./home.module.css";
import type { Metadata } from "next";

const APP_NAME = "NoteHub";
const APP_URL = "http://localhost:3000";
const OG_IMAGE = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  title: "Сторінку не знайдено",
  description: "Такої сторінки не існує в NoteHub.",
  openGraph: {
    title: `Сторінку не знайдено | ${APP_NAME}`,
    description: "Такої сторінки не існує в NoteHub.",
    url: `${APP_URL}/not-found`,
    images: [{ url: OG_IMAGE }],
  },
};

export default function NotFound() {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
