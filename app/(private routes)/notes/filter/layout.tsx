import React from "react";
import css from "./LayoutNotes.module.css";

export default function FilterLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>

      <section className={css.notesWrapper}>{children}</section>
    </div>
  );
}
