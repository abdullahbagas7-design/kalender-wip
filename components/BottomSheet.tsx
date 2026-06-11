"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Edit, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { id } from "date-fns/locale/id";
import { Order } from "@/lib/supabase";

type SheetMode = "list" | "date-picker" | "add" | "edit" | "move";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  orders: Order[];
  onAddOrder: (order: Omit<Order, "id" | "created_at">) => void;
  onEditOrder: (id: string, order: Partial<Omit<Order, "id" | "created_at">>) => void;
  onDeleteOrder: (id: string) => void;
  onSetSelectedDate: (date: Date) => void;
}

const BottomSheet = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  orders, 
  onAddOrder, 
  onEditOrder, 
  onDeleteOrder,
  onSetSelectedDate,
  initialMode = "list"
}: BottomSheetProps & { initialMode?: SheetMode }) => {
  const [mode, setMode] = useState<SheetMode>(initialMode);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    client_name: "",
    phone_number: "",
    invitation_type: "",
    quantity: 1
  });
  const [tempDate, setTempDate] = useState<string>(format(new Date(2026, 5, 12), "yyyy-MM-dd"));

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setEditingOrder(null);
      setTempDate(format(new Date(2026, 5, 12), "yyyy-MM-dd"));
      setFormData({
        client_name: "",
        phone_number: "",
        invitation_type: "",
        quantity: 1
      });
    }
  }, [isOpen, initialMode]);

  const dayOrders = selectedDate 
    ? orders.filter(o => o.order_date === format(selectedDate, "yyyy-MM-dd"))
    : [];

  const handleAdd = () => {
    const dateToUse = selectedDate ? format(selectedDate, "yyyy-MM-dd") : tempDate;
    onAddOrder({
      ...formData,
      order_date: dateToUse
    });
    onClose();
  };

  const handleEdit = () => {
    if (!editingOrder) return;
    onEditOrder(editingOrder.id, formData);
    onClose();
  };

  const handleMove = (newDate: string) => {
    if (!editingOrder) return;
    onEditOrder(editingOrder.id, { order_date: newDate });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="relative w-full max-w-md glass rounded-t-[2.5rem] shadow-2xl animate-slide-up max-h-[85vh] overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-zinc-400/60 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pb-4 flex items-center justify-between">
          {mode === "date-picker" && <h3 className="text-2xl font-bold text-zinc-900">Pilih Tanggal</h3>}
          {mode === "list" && selectedDate && (
            <div>
              <h3 className="text-2xl font-bold text-zinc-900">
                {format(selectedDate, "d MMMM yyyy", { locale: id })}
              </h3>
              <p className="text-sm text-zinc-600">
                {dayOrders.length} Tamu
              </p>
            </div>
          )}
          {mode === "add" && <h3 className="text-2xl font-bold text-zinc-900">Tambah Tamu</h3>}
          {mode === "edit" && <h3 className="text-2xl font-bold text-zinc-900">Edit Tamu</h3>}
          {mode === "move" && <h3 className="text-2xl font-bold text-zinc-900">Pindah Tanggal</h3>}
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/30 rounded-2xl transition-all"
          >
            <X className="w-6 h-6 text-zinc-700" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-8 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Mode: Date Picker */}
          {mode === "date-picker" && (
            <div className="space-y-6">
              <div className="glass rounded-2xl p-4">
                <label className="text-sm font-semibold text-zinc-700 block mb-3">Tanggal Acara</label>
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/40 rounded-2xl border-none focus:ring-2 focus:ring-zinc-300 outline-none text-zinc-900 text-base"
                />
              </div>
              <button
                onClick={() => {
                  // Update selected date from parent component using callback
                  const newDate = new Date(tempDate + "T00:00:00");
                  onSetSelectedDate(newDate);
                  setMode("add");
                }}
                className="w-full py-4 bg-gradient-to-br from-zinc-900 to-zinc-700 text-white rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all active:scale-95"
              >
                Lanjutkan
              </button>
            </div>
          )}
          
          {/* Mode: List */}
          {mode === "list" && (
            <>
              {dayOrders.length === 0 ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-16 h-16 text-green-500/60 mx-auto mb-4" />
                  <p className="text-zinc-600">Belum ada tamu</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dayOrders.map((order) => (
                    <div key={order.id} className="glass rounded-2xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-zinc-900">{order.client_name}</h4>
                          <p className="text-sm text-zinc-600">{order.phone_number}</p>
                          {order.invitation_type && (
                            <p className="text-xs text-zinc-500 mt-1">{order.invitation_type}</p>
                          )}
                          {order.quantity > 1 && (
                            <p className="text-xs text-zinc-500">x{order.quantity}</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-2">
                          <button
                            onClick={() => {
                              setEditingOrder(order);
                              setFormData({
                                client_name: order.client_name,
                                phone_number: order.phone_number,
                                invitation_type: order.invitation_type || "",
                                quantity: order.quantity || 1
                              });
                              setMode("edit");
                            }}
                            className="p-2 hover:bg-white/40 rounded-xl transition-all text-zinc-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingOrder(order);
                              setMode("move");
                            }}
                            className="p-2 hover:bg-white/40 rounded-xl transition-all text-blue-600"
                          >
                            <CalendarIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteOrder(order.id)}
                            className="p-2 hover:bg-red-100/40 rounded-xl transition-all text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Button */}
              <button
                onClick={() => setMode("add")}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-br from-zinc-900 to-zinc-700 text-white rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Tambah Tamu Baru
              </button>
            </>
          )}

          {/* Mode: Add / Edit */}
          {(mode === "add" || mode === "edit") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="Masukkan nama"
                  className="w-full px-4 py-3 bg-white/40 rounded-2xl border-none focus:ring-2 focus:ring-zinc-300 outline-none text-zinc-900 placeholder-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Nomor HP</label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-3 bg-white/40 rounded-2xl border-none focus:ring-2 focus:ring-zinc-300 outline-none text-zinc-900 placeholder-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Jenis Undangan (Opsional)</label>
                <input
                  type="text"
                  value={formData.invitation_type}
                  onChange={(e) => setFormData({ ...formData, invitation_type: e.target.value })}
                  placeholder="misal: Amplop, Lembar Insert"
                  className="w-full px-4 py-3 bg-white/40 rounded-2xl border-none focus:ring-2 focus:ring-zinc-300 outline-none text-zinc-900 placeholder-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Jumlah (Opsional)</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-3 bg-white/40 rounded-2xl border-none focus:ring-2 focus:ring-zinc-300 outline-none text-zinc-900 placeholder-zinc-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setMode("list")}
                  className="flex-1 py-3 bg-white/40 text-zinc-800 rounded-2xl font-semibold hover:bg-white/50 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={mode === "add" ? handleAdd : handleEdit}
                  disabled={!formData.client_name || !formData.phone_number}
                  className="flex-1 py-3 bg-gradient-to-br from-zinc-900 to-zinc-700 text-white rounded-2xl font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mode === "add" ? "Simpan" : "Update"}
                </button>
              </div>
            </div>
          )}

          {/* Mode: Move */}
          {mode === "move" && selectedDate && (
            <div className="space-y-4">
              <p className="text-zinc-700 text-center py-4">
                Pindahkan <span className="font-semibold">{editingOrder?.client_name}</span> ke tanggal lain
              </p>
              
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 14 }, (_, i) => {
                  const date = addDays(selectedDate, i - 7);
                  return (
                    <button
                      key={i}
                      onClick={() => handleMove(format(date, "yyyy-MM-dd"))}
                      className="aspect-square flex flex-col items-center justify-center glass rounded-2xl hover:bg-white/50 transition-all"
                    >
                      <span className="text-xs text-zinc-500">{format(date, "EEE", { locale: id })}</span>
                      <span className="text-lg font-semibold text-zinc-800">{format(date, "d")}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setMode("list")}
                className="w-full py-3 bg-white/40 text-zinc-800 rounded-2xl font-semibold hover:bg-white/50 transition-all"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
