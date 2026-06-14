"use client";

import React from "react";
import { Calendar, Plus, Settings } from "lucide-react";

type View = "home" | "settings";

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onAddClick: () => void;
}

const Navigation = ({ currentView, onViewChange, onAddClick }: NavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-6 px-4 landscape:pb-2">
      <div className="max-w-md mx-auto glass rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-2 landscape:p-1">
        <div className="grid grid-cols-3 gap-1">
          {/* Home Button */}
          <button
            onClick={() => onViewChange("home")}
            className={`flex flex-col items-center justify-center py-3 landscape:py-1 rounded-2xl transition-all duration-200 ${
              currentView === "home"
                ? "bg-white/50 shadow-sm"
                : "hover:bg-white/20"
            }`}
          >
            <Calendar
              className={`w-6 h-6 mb-1 landscape:w-5 landscape:h-5 landscape:mb-0 transition-colors ${
                currentView === "home" ? "text-zinc-900" : "text-zinc-500"
              }`}
            />
            <span
              className={`text-xs font-semibold landscape:text-[10px] transition-colors ${
                currentView === "home" ? "text-zinc-900" : "text-zinc-500"
              }`}
            >
              Kalender
            </span>
          </button>

          {/* Add Button */}
          <button
            onClick={onAddClick}
            className="flex flex-col items-center justify-center py-3 landscape:py-1 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-700 text-white shadow-lg hover:scale-105 transition-all duration-200 active:scale-95"
          >
            <Plus className="w-7 h-7 mb-1 landscape:w-5 landscape:h-5 landscape:mb-0" />
            <span className="text-xs font-semibold landscape:text-[10px]">Tambah</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => onViewChange("settings")}
            className={`flex flex-col items-center justify-center py-3 landscape:py-1 rounded-2xl transition-all duration-200 ${
              currentView === "settings"
                ? "bg-white/50 shadow-sm"
                : "hover:bg-white/20"
            }`}
          >
            <Settings
              className={`w-6 h-6 mb-1 landscape:w-5 landscape:h-5 landscape:mb-0 transition-colors ${
                currentView === "settings" ? "text-zinc-900" : "text-zinc-500"
              }`}
            />
            <span
              className={`text-xs font-semibold landscape:text-[10px] transition-colors ${
                currentView === "settings" ? "text-zinc-900" : "text-zinc-500"
              }`}
            >
              Pengaturan
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
