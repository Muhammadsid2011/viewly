import { useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import SideNavBar from '../components/SideNavBar';
import CategoryChips from '../components/CategoryChips';
import VideoGrid from '../components/VideoGrid';

function HomeFeed() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 md:ml-64 w-full bg-background flex flex-col">
          <CategoryChips activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          <VideoGrid />
        </main>
      </div>
    </div>
  );
}

export default HomeFeed;