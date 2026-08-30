import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { TopNavBar, SideNavBar } from "../components";

// Routes that show the left navigation rail (and its mobile drawer). The watch,
// dashboard, and upload views are full-width per the designs, so they omit it.
const SIDEBAR_PREFIXES = ["/search", "/channel", "/liked", "/history"];

function Layout() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const { pathname } = useLocation();

  const showSidebar =
    pathname === "/" || SIDEBAR_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <TopNavBar
        onMenuClick={() => setIsSideNavOpen((v) => !v)}
        isOpen={isSideNavOpen}
        showMenuButton={showSidebar}
      />
      {showSidebar && (
        <SideNavBar isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />
      )}
      <main className={`flex-1 min-w-0 ${showSidebar ? "md:ml-64" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
