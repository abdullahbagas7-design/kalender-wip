"use client";

import React from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval,
  isToday
} from "date-fns";
import { id } from "date-fns/locale/id";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { Order } from "@/lib/supabase";

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  orders: Order[];
  maxCapacity: number;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

const Calendar = ({ 
  selectedDate, 
  onDateSelect, 
  orders, 
  maxCapacity,
  currentMonth,
  onMonthChange
}: CalendarProps) => {
  const nextMonth = () => onMonthChange(addMonths(currentMonth, 1));
  const prevMonth = () => onMonthChange(subMonths(currentMonth, 1));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextMonth,
    onSwipedRight: prevMonth,
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getCapacityStatus = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayOrders = orders.filter(o => o.order_date === dateStr);
    const count = dayOrders.length;
    
    if (count === 0) return "empty";
    if (count >= maxCapacity) return "full";
    if (count >= maxCapacity * 0.7) return "almost";
    return "loose";
  };

  const getCapacityCircleClass = (status: string) => {
    switch (status) {
      case "full":
        return "w-10 h-10 landscape:w-9 landscape:h-9 bg-red-500/20";
      case "almost":
        return "w-8 h-8 landscape:w-7 landscape:h-7 bg-orange-500/20";
      case "loose":
        return "w-6 h-6 landscape:w-5 landscape:h-5 bg-green-500/20";
      default:
        return "";
    }
  };

  const daysOfWeek = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  return (
    <div className="w-full max-w-md mx-auto landscape:max-w-2xl landscape:px-2">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pb-4 landscape:pb-2">
        <h2 className="text-2xl font-bold text-zinc-900 capitalize landscape:text-xl">
          {format(currentMonth, "MMMM yyyy", { locale: id })}
        </h2>
        <div className="flex gap-1">
          <button 
            onClick={prevMonth}
            className="p-3 landscape:p-2 hover:bg-white/30 rounded-2xl transition-all duration-200 glass"
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft className="w-6 h-6 landscape:w-5 landscape:h-5 text-zinc-800" />
          </button>
          <button 
            onClick={nextMonth}
            className="p-3 landscape:p-2 hover:bg-white/30 rounded-2xl transition-all duration-200 glass"
            aria-label="Bulan berikutnya"
          >
            <ChevronRight className="w-6 h-6 landscape:w-5 landscape:h-5 text-zinc-800" />
          </button>
        </div>
      </div>
      
      {/* Calendar Card — swipeable on mobile */}
      <div
        {...swipeHandlers}
        className="w-full glass rounded-[2.5rem] landscape:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 landscape:p-4 touch-pan-y select-none"
      >
        {/* Days of Week */}
        <div className="grid grid-cols-7 mb-3 landscape:mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-2 landscape:py-1 text-center text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-3 gap-x-1 landscape:gap-y-1.5 landscape:gap-x-0.5">
          {calendarDays.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isDayToday = isToday(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const status = getCapacityStatus(day);
            
            return (
              <div 
                key={idx}
                onClick={() => isCurrentMonth && onDateSelect(day)}
                className={`relative aspect-square flex flex-col items-center justify-center cursor-pointer rounded-2xl landscape:rounded-xl transition-all duration-300 ${
                  !isCurrentMonth 
                    ? "opacity-0 pointer-events-none" 
                    : "hover:scale-105 hover:bg-white/40"
                } ${
                  isSelected 
                    ? "bg-white/60 scale-105" 
                    : ""
                }`}
              >
                {/* Capacity indicator — translucent circle */}
                {status !== "empty" && (
                  <div
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${getCapacityCircleClass(status)}`}
                  />
                )}

                {/* Today's highlight */}
                {isDayToday && (
                  <div className="absolute inset-1 landscape:inset-0.5 rounded-2xl landscape:rounded-xl bg-blue-500" />
                )}
                
                <span className={`text-sm landscape:text-xs font-semibold relative z-10 ${
                  isDayToday ? "text-white" : "text-zinc-800"
                }`}>
                  {format(day, "d")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
