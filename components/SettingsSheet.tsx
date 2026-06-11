"use client";

import React from "react";
import { Settings2, Trash2, AlertCircle } from "lucide-react";

interface SettingsSheetProps {
  maxCapacity: number;
  onCapacityChange: (newCapacity: number) => void;
  onClearOldData: () => void;
}

const SettingsSheet = ({ maxCapacity, onCapacityChange, onClearOldData }: SettingsSheetProps) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center pt-2">
        <div className="w-16 h-16 glass rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Settings2 className="w-8 h-8 text-zinc-800" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900">Pengaturan</h2>
      </div>

      {/* Capacity Setting */}
      <div className="glass rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-zinc-900">Kapasitas Harian</h3>
            <p className="text-sm text-zinc-600">Batas tamu per hari</p>
          </div>
          <div className="text-3xl font-bold text-zinc-900">{maxCapacity}</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onCapacityChange(Math.max(1, maxCapacity - 1))}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-2xl font-semibold text-zinc-800 hover:bg-white/50 transition-all"
          >
            -
          </button>
          <input
            type="range"
            min="1"
            max="50"
            value={maxCapacity}
            onChange={(e) => onCapacityChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-white/40 rounded-full appearance-none cursor-pointer accent-zinc-800"
          />
          <button
            onClick={() => onCapacityChange(maxCapacity + 1)}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-2xl font-semibold text-zinc-800 hover:bg-white/50 transition-all"
          >
            +
          </button>
        </div>
      </div>

      {/* Clear Old Data */}
      <div className="glass rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100/30">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-100/50 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900">Hapus Data Lama</h3>
            <p className="text-sm text-zinc-600">Hapus semua data sebelum 30 hari</p>
          </div>
        </div>

        <button
          onClick={onClearOldData}
          className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all active:scale-95"
        >
          <Trash2 className="w-5 h-5" />
          Hapus Data Lampau
        </button>
      </div>
    </div>
  );
};

export default SettingsSheet;
