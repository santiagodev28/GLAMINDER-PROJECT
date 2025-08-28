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
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "afternoon":
        return "bg-orange-50 border-orange-200 text-orange-800";
      case "evening":
        return "bg-red-50 border-red-200 text-red-800";
      case "night":
        return "bg-purple-50 border-purple-200 text-purple-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
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
      <div className="text-center py-8">
        <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay horarios disponibles
        </h3>
        <p className="text-gray-500">
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Horarios Disponibles
        </h3>
        <p className="text-gray-600">
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
            <div key={category} className="space-y-3">
              <div className="flex items-center">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getTimeCategoryColor(
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
                        relative p-4 rounded-lg border-2 transition-all duration-200
                        ${
                          isSelected
                            ? "border-orange-500 bg-orange-500 text-white shadow-lg transform scale-105"
                            : isAvailable
                            ? "border-gray-200 hover:border-orange-300 hover:bg-orange-50 cursor-pointer"
                            : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
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
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1">
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <ClockIcon className="w-5 h-5 text-blue-500 mr-2" />
            <div>
              <p className="font-medium text-blue-800">
                Horario seleccionado: {formatTime(selectedTime)}
              </p>
              <p className="text-sm text-blue-600">
                {employeeName} estará disponible en este horario
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notas */}
      <div className="text-xs text-gray-500 text-center">
        <p>
          Los horarios mostrados están basados en la disponibilidad del empleado
        </p>
        <p>Selecciona un horario para continuar con tu cita</p>
      </div>
    </div>
  );
};

export default TimeSlotSelector;
