import { useState, useEffect } from "react";
import { ClockIcon, CheckIcon } from "@heroicons/react/24/outline";

const TimeSlotSelector = ({
  schedules,
  selectedSchedule,
  onScheduleSelect,
  selectedDate,
  employeeName,
}) => {
  const [groupedSchedules, setGroupedSchedules] = useState({});
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (schedules && schedules.length > 0) {
      groupSchedulesByTime();
    }
  }, [schedules]);

  const groupSchedulesByTime = () => {
    const grouped = {};

    schedules.forEach((schedule) => {
      const time = schedule.horario_hora_inicio;
      if (!grouped[time]) {
        grouped[time] = [];
      }
      grouped[time].push(schedule);
    });

    setGroupedSchedules(grouped);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (groupedSchedules[time] && groupedSchedules[time].length > 0) {
      onScheduleSelect(groupedSchedules[time][0]); // Seleccionar el primer horario disponible
    }
  };

  const formatTime = (time) => {
    // Asumiendo que time está en formato "HH:MM"
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTimeCategory = (time) => {
    const [hours] = time.split(":");
    const hour = parseInt(hours);

    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  };

  const getTimeCategoryColor = (category) => {
    switch (category) {
      case "morning":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      case "afternoon":
        return "bg-orange-500/10 border-orange-500/20 text-orange-400";
      case "evening":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      case "night":
        return "bg-purple-500/10 border-purple-500/20 text-purple-400";
      default:
        return "bg-[#31343A]/50 border-[#31343A] text-[#B0B3B8]";
    }
  };

  const getTimeCategoryLabel = (category) => {
    switch (category) {
      case "morning":
        return "Mañana";
      case "afternoon":
        return "Tarde";
      case "evening":
        return "Noche";
      case "night":
        return "Noche";
      default:
        return "";
    }
  };

  if (!schedules || schedules.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-[#D1A04D]/20 to-[#B47B1C]/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <ClockIcon className="w-10 h-10 text-[#D1A04D]" />
        </div>
        <h3 className="text-lg font-medium text-[#F5F5F5] mb-2">
          No hay horarios disponibles
        </h3>
        <p className="text-[#B0B3B8]">
          No hay horarios disponibles para {employeeName} en esta fecha
        </p>
      </div>
    );
  }

  // Ordenar horarios por hora
  const sortedTimes = Object.keys(groupedSchedules).sort((a, b) => {
    const timeA = new Date(`2000-01-01T${a}`);
    const timeB = new Date(`2000-01-01T${b}`);
    return timeA - timeB;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-[#F5F5F5] mb-3">
          Horarios Disponibles
        </h3>
        <p className="text-[#B0B3B8] text-lg">
          {employeeName} •{" "}
          {selectedDate ? new Date(selectedDate).toLocaleDateString() : ""}
        </p>
      </div>

      {/* Horarios agrupados por categoría */}
      <div className="space-y-6">
        {["morning", "afternoon", "evening", "night"].map((category) => {
          const categoryTimes = sortedTimes.filter(
            (time) => getTimeCategory(time) === category
          );

          if (categoryTimes.length === 0) return null;

          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center">
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${getTimeCategoryColor(
                    category
                  )}`}
                >
                  {getTimeCategoryLabel(category)}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categoryTimes.map((time) => {
                  const isSelected = selectedTime === time;
                  const isAvailable =
                    groupedSchedules[time] && groupedSchedules[time].length > 0;

                  return (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      disabled={!isAvailable}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg
                        ${
                          isSelected
                            ? "border-[#D1A04D] bg-gradient-to-r from-[#D1A04D] to-[#B47B1C] text-white shadow-lg transform scale-105"
                            : isAvailable
                            ? "border-[#31343A] bg-[#1F1F1F]/50 text-[#F5F5F5] hover:border-[#D1A04D]/50 hover:bg-[#1F1F1F]/70 cursor-pointer hover:scale-105"
                            : "border-[#1F1F1F]/30 bg-[#1F1F1F]/20 text-[#B0B3B8]/50 cursor-not-allowed"
                        }
                      `}
                    >
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {formatTime(time)}
                        </div>
                        {isAvailable && (
                          <div className="text-xs mt-1 opacity-75">
                            {groupedSchedules[time].length} slot
                            {groupedSchedules[time].length > 1 ? "s" : ""}{" "}
                            disponible
                            {groupedSchedules[time].length > 1 ? "s" : ""}
                          </div>
                        )}
                      </div>

                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-[#D1A04D] text-white rounded-full p-1 shadow-lg">
                          <CheckIcon className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      {selectedTime && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center">
            <ClockIcon className="w-6 h-6 text-blue-400 mr-3" />
            <div>
              <p className="font-medium text-[#F5F5F5] text-lg">
                Horario seleccionado: {formatTime(selectedTime)}
              </p>
              <p className="text-sm text-[#B0B3B8]">
                {employeeName} estará disponible en este horario
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notas */}
      <div className="text-sm text-[#B0B3B8] text-center">
        <p>
          Los horarios mostrados están basados en la disponibilidad del empleado
        </p>
        <p>Selecciona un horario para continuar con tu cita</p>
      </div>
    </div>
  );
};

export default TimeSlotSelector;
