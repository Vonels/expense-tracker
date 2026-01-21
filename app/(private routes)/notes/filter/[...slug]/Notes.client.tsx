"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchNotes } from "@/lib/api/clientApi";
import css from "./NotesPage.module.css";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Link from "next/link";

export default function NotesClient({ activeTag }: { activeTag?: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const { data } = useQuery({
    queryKey: ["notes", currentPage, query, activeTag],
    queryFn: () => fetchNotes(currentPage, query, activeTag),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          query={query}
          setState={(newQuery: string, page: number) => {
            setQuery(newQuery);
            setCurrentPage(page);
          }}
        />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            setPage={setCurrentPage}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      <NoteList notes={data?.notes ?? []} />
    </div>
  );
}
