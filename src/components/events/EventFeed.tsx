"use client";

import { useState } from "react";
import EventCard from "./EventCard";
import EventCalendar from "./EventCalendar";

interface EventFeedProps {
  events: any[];
}

const EventFeed = ({ events }: EventFeedProps) => {
  const [activeTab, setActiveTab] = useState("Todos");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

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
