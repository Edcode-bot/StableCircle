import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { Home, CircleDollarSign, PiggyBank, Trophy, User } from "lucide-react";

interface BottomNavProps {
  className?: string;
}

export function BottomNavigation({ className }: BottomNavProps) {
  const [location] = useLocation();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      href: "/dashboard",
      active: location === "/dashboard",
    },
    {
      icon: CircleDollarSign,
      label: "Hubs",
      href: "/hubs",
      active: location.startsWith("/hubs") || location.startsWith("/group"),
    },
    {
      icon: PiggyBank,
      label: "Save",
      href: "/create-hub",
      active: location === "/create-hub" || location === "/create-group",
    },
    {
      icon: Trophy,
      label: "Leaderboard",
      href: "/leaderboard",
      active: location === "/leaderboard",
    },
    {
      icon: User,
      label: "Profile",
      href: "/profile",
      active: location === "/profile",
    },
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700",
      "md:hidden", // Only show on mobile
      className
    )}>
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 text-xs transition-colors",
                item.active 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}