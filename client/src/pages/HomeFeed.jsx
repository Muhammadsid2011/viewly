import { useState } from "react";
import { CategoryChips, VideoGrid } from "../components";

// Category labels map to server-side search queries. "All" clears the filter.
const CATEGORY_QUERY = {
  All: "",
  Music: "music",
  Gaming: "gaming",
  Tech: "tech",
  Live: "live",
  News: "news",
  Sports: "sports",
  Podcasts: "podcasts",
};

function HomeFeed() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="flex flex-col">
      <CategoryChips activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <VideoGrid
        query={CATEGORY_QUERY[activeCategory] ?? ""}
        emptyMessage={
          activeCategory === "All"
            ? "No videos have been published yet."
            : `No videos found in ${activeCategory}.`
        }
      />
    </div>
  );
}

export default HomeFeed;
