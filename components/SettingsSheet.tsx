"use client";

import React from "react";
import { Settings2, Trash2, AlertCircle, RefreshCw, Clock } from "lucide-react";

interface SettingsSheetProps {
  maxCapacity: number;
  onCapacityChange: (newCapacity: number) => void;
  isAutoRotate: boolean;
  onAutoRotateChange: (autoRotate: boolean) => void;
  rotateInterval: number;
  onRotateIntervalChange: (interval: number) => void;
  onClearOldData: () => void;
}

const SettingsSheet = ({ 
  maxCapacity, 
  onCapacityChange, 
  isAutoRotate,
  onAutoRotateChange,
  rotateInterval,
  onRotateIntervalChange,
  onClearOldData 
}: SettingsSheetProps) => {
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

      {/* Auto Rotate Setting */}
      <div className="glass rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
              <RefreshCw className={`w-6 h-6 ${isAutoRotate ? "text-blue-500 animate-spin-slow" : "text-zinc-400"}`} />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">Rotasi Otomatis</h3>
              <p className="text-sm text-zinc-600">Pindah bulan otomatis</p>
            </div>
          </div>
          <button
            onClick={() => onAutoRotateChange(!isAutoRotate)}
            className={`w-14 h-8 rounded-full transition-all duration-300 relative ${
              isAutoRotate ? "bg-blue-500" : "bg-zinc-300"
            }`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
              isAutoRotate ? "left-7" : "left-1"
            }`} />
          </button>
        </div>

        {isAutoRotate && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-700">Interval Rotasi</span>
              </div>
              <span className="text-lg font-bold text-zinc-900">{rotateInterval} detik</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={rotateInterval}
              onChange={(e) => onRotateIntervalChange(parseInt(e.target.value))}
              className="w-full h-2 bg-white/40 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        )}
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
