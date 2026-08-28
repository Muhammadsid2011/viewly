const categories = [
  { label: 'All', active: true },
  { label: 'Music', active: false },
  { label: 'Gaming', active: false },
  { label: 'Tech', active: false },
  { label: 'Live', active: false },
  { label: 'News', active: false },
  { label: 'Sports', active: false },
  { label: 'Podcasts', active: false },
];

function CategoryChip({ label, active, onClick }) {
  return (
    <button
      onClick={() => onClick(label)}
      className={`whitespace-nowrap px-4 py-1.5 font-body-md rounded-lg transition-colors ${
        active
          ? 'bg-on-surface text-background'
          : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant'
      }`}
    >
      {label}
    </button>
  );
}

function CategoryChips({ activeCategory, onCategoryChange }) {
  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm px-4 md:px-lg py-sm border-b border-surface-container flex items-center gap-sm overflow-x-auto hide-scrollbar w-full">
      {categories.map((category) => (
        <CategoryChip
          key={category.label}
          label={category.label}
          active={activeCategory === category.label}
          onClick={onCategoryChange}
        />
      ))}
    </div>
  );
}

export default CategoryChips;