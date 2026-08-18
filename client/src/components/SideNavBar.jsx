import {
  Home,
  Package,
  History,
  ThumbsUp,
  ListMusic,
  Flame,
  Music,
  Gamepad2,
  Film,
} from 'lucide-react';

const iconMap = {
  home: Home,
  subscriptions: Package,
  history: History,
  thumb_up: ThumbsUp,
  playlist_play: ListMusic,
  local_fire_department: Flame,
  music_note: Music,
  sports_esports: Gamepad2,
  movie: Film,
};

const navItems = [
  { section: 'Main', items: [
    { icon: 'home', label: 'Home', active: true },
    { icon: 'subscriptions', label: 'Subscriptions', active: false },
  ]},
  { section: 'Library', items: [
    { icon: 'history', label: 'History' },
    { icon: 'thumb_up', label: 'Liked Videos' },
    { icon: 'playlist_play', label: 'Playlists' },
  ]},
  { section: 'Explore', items: [
    { icon: 'local_fire_department', label: 'Trending' },
    { icon: 'music_note', label: 'Music' },
    { icon: 'sports_esports', label: 'Gaming' },
    { icon: 'movie', label: 'Movies' },
  ]},
];

function NavItem({ icon, label, active = false }) {
  const IconComponent = iconMap[icon];
  return (
    <a
      className={`flex items-center gap-md p-3 rounded-lg transition-all hover:scale-[1.02] active:scale-100 ${
        active
          ? 'bg-surface-container-high text-on-surface font-bold'
          : 'text-on-surface-variant hover:bg-surface-container-highest'
      }`}
      href="#"
    >
      {IconComponent && <IconComponent className="size-5" aria-hidden="true" />}
      <span className="font-body-md">{label}</span>
    </a>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="px-3 py-sm">
      <h3 className="font-title-md text-on-surface">{title}</h3>
      {subtitle && <p className="font-meta-sm text-on-surface-variant">{subtitle}</p>}
    </div>
  );
}

function SideNavBar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <nav className={`flex-col fixed left-0 top-16 h-[calc(100vh-64px)] p-md overflow-y-auto w-64 bg-surface-container z-50 hide-scrollbar border-r border-surface-container-high transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:fixed md:h-[calc(100vh-64px)] md:w-64 md:z-40`}>
        {navItems.map((section, sectionIndex) => (
          <div key={section.section} className="mb-lg">
            {sectionIndex > 0 && <hr className="border-surface-container-highest my-sm" />}
            <SectionHeader title={section.section} subtitle={section.section === 'Library' ? 'Your content' : undefined} />
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  active={item.active}
                  fill={item.fill}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </>
  );
}

export default SideNavBar;