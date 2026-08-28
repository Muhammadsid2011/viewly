import { Home, ThumbsUp, History, LayoutDashboard, Upload, Flame, Music, Gamepad2, Film } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

// `to` routes use NavLink (route-matched active state); `search` items are plain
// links into the search results page and are never shown as "active".
const sections = [
  {
    section: "Main",
    items: [
      { icon: Home, label: "Home", to: "/", end: true },
      { icon: History, label: "History", to: "/history" },
      { icon: ThumbsUp, label: "Liked Videos", to: "/liked" },
    ],
  },
  {
    section: "Creator",
    subtitle: "Your content",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
      { icon: Upload, label: "Upload", to: "/upload" },
    ],
  },
  {
    section: "Explore",
    items: [
      { icon: Flame, label: "Trending", search: "" },
      { icon: Music, label: "Music", search: "music" },
      { icon: Gamepad2, label: "Gaming", search: "gaming" },
      { icon: Film, label: "Movies", search: "movie" },
    ],
  },
];

const baseItem =
  "flex items-center gap-md p-3 rounded-lg transition-all hover:scale-[1.02] active:scale-100";

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
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <nav
        className={`flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] p-md overflow-y-auto w-64 bg-surface-container z-50 hide-scrollbar border-r border-surface-container-high transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:z-40`}
      >
        {sections.map((section, sectionIndex) => (
          <div key={section.section} className="mb-lg">
            {sectionIndex > 0 && <hr className="border-surface-container-highest my-sm" />}
            <SectionHeader title={section.section} subtitle={section.subtitle} />
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                if (item.search !== undefined) {
                  const to = item.search ? `/search?query=${item.search}` : "/search";
                  return (
                    <Link
                      key={item.label}
                      to={to}
                      onClick={onClose}
                      className={`${baseItem} text-on-surface-variant hover:bg-surface-container-highest`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                      <span className="font-body-md">{item.label}</span>
                    </Link>
                  );
                }
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `${baseItem} ${
                        isActive
                          ? "bg-surface-container-high text-on-surface font-bold"
                          : "text-on-surface-variant hover:bg-surface-container-highest"
                      }`
                    }
                  >
                    <Icon className="size-5" aria-hidden="true" />
                    <span className="font-body-md">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </>
  );
}

export default SideNavBar;
