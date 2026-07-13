"use client";

import { useState } from "react";
import EventCard from "./EventCard";
import EventCalendar from "./EventCalendar";
import CreateEventForm from "./CreateEventForm";

interface EventFeedProps {
  events: any[];
}

const EventFeed = ({ events }: EventFeedProps) => {
  const [activeTab, setActiveTab] = useState("Todos");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const tabs = [
    "Todos",
    "Académicos",
    "Defensa Integral / LUNA",
    "Culturales y Deportivos",
  ];

  const filteredEvents = activeTab === "Todos" 
    ? events 
    : events.filter(e => e.category === activeTab);

  return (
    <div className="flex flex-col gap-6">
      {/* Featured Event Banner */}
      {events.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex flex-col gap-2 z-10">
            <span className="uppercase text-xs font-bold tracking-wider text-blue-200">Próximo Evento Destacado</span>
            <h3 className="text-2xl font-bold">{events[0].title}</h3>
            <div className="flex flex-col sm:flex-row gap-4 mt-1 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>{new Date(events[0].date).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "long" })} - {new Date(events[0].date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>{events[0].location}</span>
              </div>
            </div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/30 z-10 flex flex-col items-center shrink-0">
            <span className="text-[10px] uppercase font-semibold opacity-80">Categoría</span>
            <span className="font-bold text-sm text-center">{events[0].category}</span>
          </div>
        </div>
      )}

      {/* Toggle Form Button */}
      <div className="flex justify-end">
        <button 
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-md transition-colors"
        >
          {isFormVisible ? "Ocultar Formulario" : "➕ Crear Evento Rápido"}
        </button>
      </div>

      {/* Create Event Form */}
      {isFormVisible && (
        <CreateEventForm onSuccess={() => setIsFormVisible(false)} />
      )}
      {/* Filters & View Toggle */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Categories (Tabs) */}
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "bg-blue-500 text-white shadow-sm" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg self-start sm:self-center">
          <button 
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-blue-500" : "text-gray-500 hover:text-gray-700"}`}
            title="Vista de Lista"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <button 
            onClick={() => setViewMode("calendar")}
            className={`p-2 rounded-md transition-colors ${viewMode === "calendar" ? "bg-white shadow-sm text-blue-500" : "text-gray-500 hover:text-gray-700"}`}
            title="Vista de Calendario"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === "list" ? (
        <div className="flex flex-col gap-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="text-center p-12 bg-white rounded-lg shadow-md text-gray-500">
              No hay eventos próximos en esta categoría.
            </div>
          )}
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in duration-300">
          <EventCalendar events={filteredEvents} />
        </div>
      )}
    </div>
  );
};

export default EventFeed;
