import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import css from "./NotesPage.module.css";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0];
  const isAll = !tag || tag === "all";

  const title = isAll ? "All Notes | NoteHub" : `${tag} Notes | NoteHub`;
  const description = isAll
    ? "Browse all your notes in one place."
    : `View and manage all notes categorized under ${tag}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-six-iota.vercel.app/notes/filter/${
        tag || "all"
      }`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          alt: "NoteHub Preview",
        },
      ],
      type: "website",
    },
  };
}

export default async function MainNotesPage({ params }: Props) {
  const { slug } = await params;
  const slugValue = slug?.[0];

  const activeTag = slugValue === "all" || !slugValue ? undefined : slugValue;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", activeTag],
    queryFn: () => fetchNotes(1, "", activeTag),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={css.app}>
        <NotesClient activeTag={activeTag} />
      </div>
    </HydrationBoundary>
  );
}
