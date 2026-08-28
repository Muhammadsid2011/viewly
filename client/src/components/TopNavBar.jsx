import { useState } from "react";
import { Menu, X, Search, Upload, Bell, User, LayoutDashboard, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { logout } from "../api/auth";
import { clearToken } from "../api/axios";
import Avatar from "./Avatar";

function TopNavBar({ onMenuClick, isOpen, showMenuButton = true }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logout);

  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) navigate(`/search?query=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await logout();
    } catch {
      // ignore — clearing local state below is what matters for the UI
    } finally {
      clearToken();
      logoutUser();
      navigate("/");
    }
  };

  return (
    <header className="flex justify-between items-center gap-sm px-4 md:px-lg h-16 w-full sticky top-0 z-50 bg-surface border-b border-surface-container-high">
      <div className="flex items-center gap-md min-w-0">
        {showMenuButton && (
          <button
            className="md:hidden p-2 text-on-surface hover:bg-surface-container-high rounded-full transition-colors"
            onClick={onMenuClick}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        )}
        <Link className="font-headline-lg font-black text-primary shrink-0" to="/">
          Viewly
        </Link>
      </div>

      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-lg">
        <div className="flex w-full bg-surface-container rounded-full border border-surface-container-highest focus-within:border-on-surface transition-colors">
          <input
            className="flex-1 bg-transparent border-none rounded-l-full px-lg py-2 focus:ring-0 focus:outline-none text-on-surface placeholder:text-on-surface-variant font-body-md min-w-0"
            placeholder="Search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            aria-label="Search"
            className="px-md bg-surface-container-highest rounded-r-full hover:bg-surface-variant transition-colors flex items-center justify-center"
          >
            <Search className="size-5 text-on-surface" aria-hidden="true" />
          </button>
        </div>
      </form>

      {user ? (
        <div className="flex items-center gap-1 sm:gap-sm">
          <button
            className="md:hidden p-2 hover:bg-surface-container-high transition-colors rounded-full flex items-center justify-center"
            onClick={() => navigate("/search")}
            aria-label="Search"
          >
            <Search className="size-5 text-on-surface" aria-hidden="true" />
          </button>
          <Link
            to="/upload"
            className="p-2 hover:bg-surface-container-high transition-colors active:scale-90 rounded-full flex items-center justify-center"
            aria-label="Upload video"
          >
            <Upload className="size-5 text-on-surface" aria-hidden="true" />
          </Link>
          <button
            className="hidden sm:flex p-2 hover:bg-surface-container-high transition-colors active:scale-90 rounded-full items-center justify-center relative"
            aria-label="Notifications"
          >
            <Bell className="size-5 text-on-surface" aria-hidden="true" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="ml-1 rounded-full hover:opacity-80 transition-opacity"
              aria-label="Account menu"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <Avatar src={user.avatar} name={user.fullName} size={32} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-high border border-surface-container-highest rounded-lg shadow-2xl overflow-hidden z-50 py-1">
                  <div className="px-4 py-3 border-b border-surface-container-highest">
                    <p className="font-title-md text-on-surface truncate">{user.fullName}</p>
                    <p className="font-meta-sm text-on-surface-variant truncate">@{user.username}</p>
                  </div>
                  <MenuLink to={`/channel/${user.username}`} icon={User} label="Your channel" onClick={() => setMenuOpen(false)} />
                  <MenuLink to="/dashboard" icon={LayoutDashboard} label="Creator dashboard" onClick={() => setMenuOpen(false)} />
                  <MenuLink to="/upload" icon={Upload} label="Upload video" onClick={() => setMenuOpen(false)} />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-md px-4 py-2.5 text-on-surface hover:bg-surface-container-highest transition-colors border-t border-surface-container-highest"
                  >
                    <LogOut className="size-5" aria-hidden="true" />
                    <span className="font-body-md">Log out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/auth/login"
            className="px-4 sm:px-5 py-2.5 rounded-full font-medium text-sm text-on-surface border border-outline-variant/50 bg-surface-container hover:bg-surface-container-high hover:border-primary/40 hover:text-primary transition-all duration-200 active:scale-95 whitespace-nowrap"
          >
            Log in
          </Link>
          <Link
            to="/auth/signup"
            className="px-4 sm:px-5 py-2.5 rounded-full font-medium text-sm text-on-primary bg-primary shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 active:scale-95 whitespace-nowrap"
          >
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
}

function MenuLink({ to, icon: Icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="w-full flex items-center gap-md px-4 py-2.5 text-on-surface hover:bg-surface-container-highest transition-colors"
    >
      <Icon className="size-5" aria-hidden="true" />
      <span className="font-body-md">{label}</span>
    </Link>
  );
}

export default TopNavBar;
