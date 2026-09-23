import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Leaf, Bell, LogOut, User as UserIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/UserContext";
import { getNotifications, markAllNotificationsRead, AppNotification, timeAgo } from "@/lib/store";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useUser();

  useEffect(() => {
    if (currentUser) {
      setNotifications(getNotifications(currentUser.id));
    } else {
      setNotifications([]);
    }
  }, [currentUser, location.pathname]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Report Waste", href: "/report" },
    { name: "Wallet", href: "/wallet" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const roleHome = currentUser?.role === "admin" ? "/admin" : currentUser?.role === "worker" ? "/worker" : "/dashboard";

  const AuthArea = () =>
    currentUser ? (
      <div className="flex items-center space-x-2">
        <DropdownMenu
          onOpenChange={(open) => {
            if (open && currentUser) markAllNotificationsRead(currentUser.id);
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center rounded-full">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="px-2 py-4 text-sm text-muted-foreground text-center">No notifications yet</div>
            ) : (
              notifications.slice(0, 8).map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start whitespace-normal">
                  <span className="text-sm">{n.message}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(n.createdAt)}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              {currentUser.name.split(" ")[0]}
              <Badge variant="secondary" className="ml-1 capitalize">{currentUser.role}</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(roleHome)}>Go to my dashboard</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ) : (
      <Button variant="eco" size="sm" onClick={() => navigate("/auth")}>
        Get Started
      </Button>
    );

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold text-foreground">Green & Clean</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <AuthArea />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "text-accent bg-accent/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                {currentUser ? (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => { navigate(roleHome); setIsOpen(false); }}>
                      {currentUser.name} ({currentUser.role})
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => { handleLogout(); setIsOpen(false); }}>
                      Log out
                    </Button>
                  </div>
                ) : (
                  <Button variant="eco" size="sm" className="w-full" onClick={() => { navigate("/auth"); setIsOpen(false); }}>
                    Get Started
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
