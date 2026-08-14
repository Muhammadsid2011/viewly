import { useState } from 'react';
import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import CategoryChips from './CategoryChips';
import VideoGrid from './VideoGrid';

function HomeFeed() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <TopNavBar />
      <div className="flex flex-1 overflow-hidden">
        <SideNavBar />
        <main className="flex-1 md:ml-64 w-full bg-background flex flex-col">
          <CategoryChips activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          <VideoGrid />
        </main>
      </div>
    </div>
  );
}

export default HomeFeed;