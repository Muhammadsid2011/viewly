import {
  Menu,
  Search,
  Upload,
  Bell,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { logout } from '../api/auth';

function TopNavBar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logout);

  const handleLogout = async (e) => {
    e?.preventDefault();

    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      logoutUser();
      navigate('/auth/signup');
    }
  };

  return (
    <header className="flex justify-between items-center px-4 md:px-lg h-16 w-full sticky top-0 z-50 bg-surface border-b border-surface-container-high">
      <div className="flex items-center gap-md">
        <button className="md:hidden p-2 text-on-surface hover:bg-surface-container-high rounded-full transition-colors">
          <Menu className="size-6" aria-hidden="true" />
        </button>
        <a className="font-headline-lg font-black text-primary" href="#">
          Viewly
        </a>
      </div>
      <div className="hidden md:flex flex-1 max-w-2xl mx-lg">
        <div className="flex w-full bg-surface-container rounded-full border border-surface-container-highest focus-within:border-on-surface transition-colors">
          <input
            className="flex-1 bg-transparent border-none rounded-l-full px-lg py-2 focus:ring-0 text-on-surface placeholder:text-on-surface-variant font-body-md"
            placeholder="Search"
            type="text"
          />
          <button className="px-md bg-surface-container-highest rounded-r-full hover:bg-surface-variant transition-colors flex items-center justify-center">
            <Search className="size-5 text-on-surface" aria-hidden="true" />
          </button>
        </div>
      </div>
      {user ? (
        <div className="flex items-center gap-sm">
          <button type="button" onClick={handleLogout} className="cursor-pointer p-2 hover:bg-surface-container-high transition-colors scale-95 active:scale-90 rounded-full flex items-center justify-center">
            Logout
          </button>
          <button className="p-2 hover:bg-surface-container-high transition-colors scale-95 active:scale-90 authrounded-full flex items-center justify-center">
            <Upload className="size-5 text-on-surface" aria-hidden="true" />
          </button>
          <button className="p-2 hover:bg-surface-container-high transition-colors scale-95 active:scale-90 rounded-full flex items-center justify-center relative">
            <Bell className="size-5 text-on-surface" aria-hidden="true" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </button>
          <button className="ml-sm w-8 h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity">
            <img
              className="w-full h-full object-cover"
              src={user?.avatar}
              alt="User avatar"
            />
          </button>
        </div>) : (
          <div className="flex items-center gap-3">
            <button
              className="px-5 py-2.5 rounded-full font-medium text-sm
               text-on-surface
               border border-outline-variant/50
               bg-surface-container
               hover:bg-surface-container-high
               hover:border-primary/40
               hover:text-primary
               transition-all duration-200
               active:scale-95"
            >
              <Link to="/auth/login">Log in</Link>
            </button>

            <button
              className="px-5 py-2.5 rounded-full font-medium text-sm
               text-on-primary
               bg-primary
               shadow-md shadow-primary/20
               hover:bg-primary/90
               hover:shadow-lg hover:shadow-primary/30
               transition-all duration-200
               active:scale-95"
            >
              <Link to="/auth/signup">Sign up</Link>
            </button>
          </div>
      )}
    </header>
  );
}

export default TopNavBar;