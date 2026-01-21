import css from "./SearchBox.module.css";
import { useDebouncedCallback } from "use-debounce";

interface SearchBoxProps {
  query: string;
  setState: (query: string, page: number) => void;
}

export default function SearchBox({ query, setState }: SearchBoxProps) {
  const handleChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setState(event.target.value, 1);
    },
    500
  );
  return (
    <input
      className={css.input}
      type="text"
      defaultValue={query}
      placeholder="Search notes"
      onChange={handleChange}
    />
  );
}
