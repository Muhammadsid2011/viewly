import { useState } from 'react';
import {
  CategoryChips,
  VideoGrid
} from "../components"

function HomeFeed() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <main className="flex-1 w-full bg-background flex flex-col md:ml-64">
        <CategoryChips activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <VideoGrid />
      </main>
    </div>
  );
}

export default HomeFeed;