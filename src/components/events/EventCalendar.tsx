import { useMemo } from "react";

interface EventCalendarProps {
  events: any[];
}

const EventCalendar = ({ events }: EventCalendarProps) => {
  // Generate a basic 30-day view for the current month for demo purposes
  const daysInMonth = 30; // Hardcoded for simplicity, can be dynamic
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Mark days that have events
  const eventDays = useMemo(() => {
    const daysWithEvents = new Set<number>();
    events.forEach(event => {
      const date = new Date(event.date);
      // If it's the current month (for a real app, do full date matching)
      daysWithEvents.add(date.getDate());
    });
    return daysWithEvents;
  }, [events]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-gray-800">Calendario de Actividades</h2>
        <span className="text-sm text-gray-500 font-medium">Este mes</span>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
        <div className="text-gray-400 font-medium">L</div>
        <div className="text-gray-400 font-medium">M</div>
        <div className="text-gray-400 font-medium">X</div>
        <div className="text-gray-400 font-medium">J</div>
        <div className="text-gray-400 font-medium">V</div>
        <div className="text-gray-400 font-medium">S</div>
        <div className="text-gray-400 font-medium">D</div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {/* Placeholder for days before start of month */}
        <div className="p-2 text-transparent">0</div>
        <div className="p-2 text-transparent">0</div>

        {days.map((day) => {
          const hasEvent = eventDays.has(day);
          return (
            <div
              key={day}
              className={`p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto relative ${
                hasEvent ? "bg-blue-100 text-blue-600 font-bold cursor-pointer hover:bg-blue-200 transition-colors" : "text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
              }`}
              title={hasEvent ? "Hay eventos este día" : ""}
            >
              {day}
              {hasEvent && (
                <span className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full"></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventCalendar;
