"use client";

import { User } from "@/types";
import { Bell, User as UserIcon, Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="h-16 bg-card border-b border-border px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button 
          className="lg:hidden p-2 hover:bg-card-hover rounded-lg transition-colors"
          onClick={() => {
            const sidebar = document.querySelector('aside');
            if (sidebar) {
              sidebar.classList.toggle('-translate-x-full');
            }
          }}
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
        
        <div>
          <h2 className="text-base sm:text-xl font-bold text-white">Security Operations Center</h2>
          <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Real-time threat intelligence monitoring</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 hover:bg-card-hover rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-severity-critical rounded-full" />
        </button>

        {user && (
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-400">{user.role}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent-blue/20 rounded-full flex items-center justify-center overflow-hidden">
              {user.image ? (
                <img 
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${user.image}`} 
                  alt={user.username} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue" />
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
