import { Film, Tv, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="gold-gradient p-2 rounded-lg">
            <Tv className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <span className="block text-xl md:text-2xl leading-none text-primary">
              ASIEMAN VIEWING CENTER
            </span>
            <p className="text-xs text-muted-foreground tracking-widest">
              KOFAR KUDU KAZAURE
            </p>
          </div>
        </Link>
        <nav className="flex gap-2">
          {isAdmin ? (
            <Link
              to="/"
              className="text-sm px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center gap-2"
            >
              <Film className="h-4 w-4" /> View Site
            </Link>
          ) : (
            <Link
              to={user ? "/admin" : "/login"}
              className="text-sm px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
