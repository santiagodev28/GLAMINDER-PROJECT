import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const DatePicker = ({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  disabledDates = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth]);

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);

    // Día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
    const firstDayOfWeek = firstDay.getDay();

    // Ajustar para que la semana empiece en lunes (1) en lugar de domingo (0)
    const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 7 : firstDayOfWeek;

    const days = [];

    // Agregar días del mes anterior para completar la primera semana
    const prevMonthLastDay = new Date(year, month, 0);
    for (let i = adjustedFirstDayOfWeek - 1; i > 0; i--) {
      const day = new Date(year, month - 1, prevMonthLastDay.getDate() - i + 1);
      days.push({
        date: day,
        isCurrentMonth: false,
        isDisabled: true,
        isSelected: false,
      });
    }

    // Agregar días del mes actual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const isDisabled = isDateDisabled(date);
      const isSelected =
        selectedDate && isSameDate(date, new Date(selectedDate));

      days.push({
        date,
        isCurrentMonth: true,
        isDisabled,
        isSelected,
      });
    }

    // Agregar días del mes siguiente para completar la última semana
    const remainingDays = 42 - days.length; // 6 semanas * 7 días = 42
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isDisabled: true,
        isSelected: false,
      });
    }

    setCalendarDays(days);
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fecha mínima
    if (minDate && date < new Date(minDate)) {
      return true;
    }

    // Fecha máxima
    if (maxDate && date > new Date(maxDate)) {
      return true;
    }

    // No permitir fechas pasadas
    if (date < today) {
      return true;
    }

    // Verificar si está en la lista de fechas deshabilitadas
    return disabledDates.some((disabledDate) =>
      isSameDate(date, new Date(disabledDate))
    );
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleDateClick = (day) => {
    if (!day.isDisabled && day.isCurrentMonth) {
      onDateSelect(day.date.toISOString().split("T")[0]);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const formatMonthYear = (date) => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getDayName = (dayIndex) => {
    const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    return days[dayIndex - 1];
  };

  return (
    <div className="bg-[#23262B]/80 backdrop-blur-md rounded-2xl shadow-lg border border-[#31343A]/50 p-6">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-3 hover:bg-[#31343A]/50 rounded-xl transition-all duration-300 text-[#B0B3B8] hover:text-[#F5F5F5]"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold text-[#F5F5F5]">
          {formatMonthYear(currentMonth)}
        </h2>

        <button
          onClick={goToNextMonth}
          className="p-3 hover:bg-[#31343A]/50 rounded-xl transition-all duration-300 text-[#B0B3B8] hover:text-[#F5F5F5]"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {[1, 2, 3, 4, 5, 6, 7].map((dayIndex) => (
          <div
            key={dayIndex}
            className="text-center text-sm font-medium text-[#B0B3B8] py-3"
          >
            {getDayName(dayIndex)}
          </div>
        ))}
      </div>

      {/* Días del calendario */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(day)}
            disabled={day.isDisabled}
            className={`
              p-3 text-sm rounded-xl transition-all duration-300 font-medium
              ${
                day.isCurrentMonth
                  ? day.isDisabled
                    ? "text-[#B0B3B8]/50 cursor-not-allowed"
                    : day.isSelected
                    ? "bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white font-semibold shadow-lg transform scale-105"
                    : "text-[#F5F5F5] hover:bg-[#31343A]/50 hover:text-[#D1A04D] hover:shadow-md hover:scale-105"
                  : "text-[#B0B3B8]/30 cursor-not-allowed"
              }
              ${day.isSelected ? "ring-2 ring-[#D1A04D]/50" : ""}
            `}
          >
            {day.date.getDate()}
          </button>
        ))}
      </div>

      {/* Leyenda */}
      <div className="mt-6 pt-6 border-t border-[#31343A]/50">
        <div className="flex items-center justify-center space-x-6 text-sm text-[#B0B3B8]">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] rounded-full mr-2 shadow-sm"></div>
            <span>Seleccionada</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#31343A] rounded-full mr-2"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#1F1F1F]/50 rounded-full mr-2"></div>
            <span>No disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
