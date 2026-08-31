import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { VideoGrid } from "../components";

function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get("query") || "";

  const submit = (e) => {
    e.preventDefault();
    const q = e.currentTarget.elements.q.value.trim();
    setParams(q ? { query: q } : {});
  };

  return (
    <div className="flex flex-col pt-4 md:pt-lg">
      {/* key={query} resets the uncontrolled input when navigation changes the query. */}
      <form key={query} onSubmit={submit} className="md:hidden px-4 mb-2">
        <div className="flex w-full bg-surface-container rounded-full border border-surface-container-highest focus-within:border-on-surface transition-colors">
          <input
            name="q"
            defaultValue={query}
            className="flex-1 bg-transparent border-none rounded-l-full px-lg py-2.5 focus:outline-none text-on-surface placeholder:text-on-surface-variant font-body-md min-w-0"
            placeholder="Search videos"
            type="text"
            autoFocus
          />
          <button
            type="submit"
            aria-label="Search"
            className="px-md bg-surface-container-highest rounded-r-full hover:bg-surface-variant transition-colors flex items-center justify-center"
          >
            <SearchIcon className="size-5 text-on-surface" aria-hidden="true" />
          </button>
        </div>
      </form>

      <h1 className="px-4 md:px-lg font-headline-lg-mobile md:font-headline-lg text-on-surface">
        {query ? `Results for “${query}”` : "Search"}
      </h1>

      <VideoGrid
        query={query}
        emptyMessage={query ? `No results for “${query}”.` : "Search for videos to get started."}
      />
    </div>
  );
}

export default Search;
