"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Search, X, ChevronLeft } from "lucide-react";
import Calendar from "@/components/Calendar";
import BottomSheet from "@/components/BottomSheet";
import Navigation from "@/components/Navigation";
import SettingsSheet from "@/components/SettingsSheet";
import { 
  Order, 
  Settings, 
  fetchOrders, 
  addOrder, 
  updateOrder, 
  deleteOrder, 
  deleteOldOrders, 
  fetchSettings, 
  updateMaxCapacity 
} from "@/lib/supabase";
import { id } from "date-fns/locale/id";

type View = "home" | "settings" | "search";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetInitialMode, setSheetInitialMode] = useState<"list" | "date-picker">("list");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [maxCapacity, setMaxCapacity] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ordersData, settingsData] = await Promise.all([
        fetchOrders(),
        fetchSettings()
      ]);
      setOrders(ordersData);
      setMaxCapacity(settingsData.max_capacity);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Gagal memuat data. Silakan periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Date select handler
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSheetInitialMode("list");
    setIsSheetOpen(true);
  };

  // CRUD handlers with Supabase
  const handleAddOrder = async (order: Omit<Order, "id" | "created_at">) => {
    try {
      const newOrder = await addOrder(order);
      setOrders(prev => [...prev, newOrder]);
    } catch (err) {
      console.error("Failed to add order:", err);
      alert("Gagal menambah pesanan.");
    }
  };

  const handleEditOrder = async (
    id: string, 
    updates: Partial<Omit<Order, "id" | "created_at">>
  ) => {
    try {
      const updatedOrder = await updateOrder(id, updates);
      setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
    } catch (err) {
      console.error("Failed to edit order:", err);
      alert("Gagal mengedit pesanan.");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error("Failed to delete order:", err);
      alert("Gagal menghapus pesanan.");
    }
  };

  const handleClearOldData = async () => {
    try {
      await deleteOldOrders(30);
      await loadData(); // Refresh data after deletion
      alert("Data lama berhasil dihapus!");
    } catch (err) {
      console.error("Failed to delete old orders:", err);
      alert("Gagal menghapus data lama.");
    }
  };

  const handleUpdateMaxCapacity = async (newCapacity: number) => {
    try {
      await updateMaxCapacity(newCapacity);
      setMaxCapacity(newCapacity);
    } catch (err) {
      console.error("Failed to update max capacity:", err);
      alert("Gagal mengupdate kapasitas.");
    }
  };

  const handleAddClick = () => {
    setSelectedDate(null);
    setSheetInitialMode("date-picker");
    setIsSheetOpen(true);
  };

  const handleSearchResultClick = (order: Order) => {
    const date = parseISO(order.order_date + "T00:00:00");
    setSelectedDate(date);
    setSheetInitialMode("list");
    setIsSheetOpen(true);
    setCurrentView("home");
    setSearchQuery("");
  };

  // Search logic
  const filteredOrders = orders.filter(order => 
    order.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.phone_number.includes(searchQuery)
  );

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center relative overflow-hidden">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="text-center relative z-10">
          <div className="w-12 h-12 border-4 border-zinc-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600">Memuat data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 pb-32 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* Error Toast */}
      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={() => setError(null)} className="text-zinc-500 hover:text-zinc-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="relative z-10 px-6 pt-14 pb-6">
        <div className="max-w-md mx-auto">
          {currentView === "search" ? (
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setCurrentView("home")}
                className="p-2 hover:bg-white/30 rounded-2xl glass transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-zinc-700" />
              </button>
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Pencarian</h1>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
                {currentView === "home" ? "Jadwal Undangan" : "Pengaturan"}
              </h1>
              {currentView === "home" && (
                <button
                  onClick={() => setCurrentView("search")}
                  className="p-3 hover:bg-white/30 rounded-2xl glass transition-all"
                >
                  <Search className="w-6 h-6 text-zinc-700" />
                </button>
              )}
            </div>
          )}
          
          {currentView === "search" ? (
            <div className="glass rounded-2xl p-3 flex items-center gap-3">
              <Search className="w-5 h-5 text-zinc-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau nomor HP..."
                className="flex-1 bg-transparent border-none outline-none text-zinc-900 placeholder-zinc-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 hover:bg-white/30 rounded-full transition-all"
                >
                  <X className="w-4 h-4 text-zinc-600" />
                </button>
              )}
            </div>
          ) : (
            <p className="text-zinc-600">
              {currentView === "home" 
                ? "Kelola jadwal dan kapasitas harian" 
                : "Atur batas kapasitas dan data"}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4">
        {currentView === "search" ? (
          <div className="max-w-md mx-auto space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="glass rounded-[2rem] p-10 text-center">
                <Search className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
                <p className="text-zinc-600">
                  {searchQuery ? "Tidak ada hasil pencarian" : "Masukkan kata kunci untuk mencari"}
                </p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  onClick={() => handleSearchResultClick(order)}
                  className="glass rounded-2xl p-4 cursor-pointer hover:bg-white/50 transition-all"
                >
                  <h4 className="font-semibold text-zinc-900">{order.client_name}</h4>
                  <p className="text-sm text-zinc-600">{order.phone_number}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {format(parseISO(order.order_date + "T00:00:00"), "d MMMM yyyy", { locale: id })}
                  </p>
                </div>
              ))
            )}
          </div>
        ) : currentView === "home" ? (
          <div className="max-w-md mx-auto">
            <Calendar 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              orders={orders}
              maxCapacity={maxCapacity}
            />
            
            {/* Legend */}
            <div className="mt-10 glass p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-sm font-semibold text-zinc-900 mb-4">Indikator Kapasitas</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-3.5 h-3.5 rounded-full shadow-[0_0_15px_rgba(52,199,89,0.6)]" style={{ backgroundColor: "#34C759" }} />
                  <span className="text-sm text-zinc-700 font-medium">Kapasitas Longgar</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3.5 h-3.5 rounded-full shadow-[0_0_15px_rgba(255,204,0,0.6)]" style={{ backgroundColor: "#FFCC00" }} />
                  <span className="text-sm text-zinc-700 font-medium">Hampir Penuh</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3.5 h-3.5 rounded-full shadow-[0_0_15px_rgba(255,59,48,0.6)]" style={{ backgroundColor: "#FF3B30" }} />
                  <span className="text-sm text-zinc-700 font-medium">Kapasitas Penuh</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <SettingsSheet 
            maxCapacity={maxCapacity}
            onCapacityChange={handleUpdateMaxCapacity}
            onClearOldData={handleClearOldData}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <Navigation 
        currentView={currentView === "search" ? "home" : currentView}
        onViewChange={(view) => setCurrentView(view as View)}
        onAddClick={handleAddClick}
      />

      {/* Bottom Sheet */}
      <BottomSheet 
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        selectedDate={selectedDate}
        orders={orders}
        onAddOrder={handleAddOrder}
        onEditOrder={handleEditOrder}
        onDeleteOrder={handleDeleteOrder}
        onSetSelectedDate={setSelectedDate}
        initialMode={sheetInitialMode}
      />
    </main>
  );
}
