import {
  Menu,
  Search,
  Upload,
  Bell,
  Loader2,
} from 'lucide-react';

function TopNavBar() {
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
      <div className="flex items-center gap-sm">
        <button className="p-2 hover:bg-surface-container-high transition-colors scale-95 active:scale-90 rounded-full flex items-center justify-center">
          <Upload className="size-5 text-on-surface" aria-hidden="true" />
        </button>
        <button className="p-2 hover:bg-surface-container-high transition-colors scale-95 active:scale-90 rounded-full flex items-center justify-center relative">
          <Bell className="size-5 text-on-surface" aria-hidden="true" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </button>
        <button className="ml-sm w-8 h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5iPTck0wZnzvnX-o8Kwqm2eGcDFIjBpOX-WO6aS7AYhcIE9OVuva-XF0tDq3BqKwp4C_KNelvsWwaaE4tlzLNGEWbnD39xwdb307neLJVKOfJzl__frdfvoyWpeyxn3pFIwmpAUn_k3CnJ9otpJTbuBtaMETlgtExACCBpo69HAXbzx4MpdQfWleXH9ZHmO19HPHxrD6SD70ycYhIPG882ws9JLxIj9HaxvmTIn0lxDiOMhdEi3mPlg"
            alt="User avatar"
          />
        </button>
      </div>
    </header>
  );
}

export default TopNavBar;