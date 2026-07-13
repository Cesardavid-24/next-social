"use client";

import { useState } from "react";
import { addQuickEvent } from "@/lib/actions";

export default function CreateEventForm({ onSuccess }: { onSuccess?: () => void }) {
  const [category, setCategory] = useState("Académicos");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !category) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await addQuickEvent(category, date, time);
      setDate("");
      setTime("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Hubo un error al crear el evento.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-in fade-in zoom-in duration-300 border border-blue-100">
      <h3 className="font-semibold text-gray-700 mb-3 text-sm flex items-center gap-2">
        <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">➕</span>
        Crear Evento Rápido
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex flex-col gap-1 w-full sm:w-auto flex-1">
          <label className="text-xs font-semibold text-gray-600">Tipo de Evento</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 p-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-slate-50"
          >
            <option value="Académicos">Académicos</option>
            <option value="Defensa Integral / LUNA">Defensa Integral / LUNA</option>
            <option value="Culturales y Deportivos">Culturales y Deportivos</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-xs font-semibold text-gray-600">Fecha</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 p-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-slate-50"
            required
          />
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-xs font-semibold text-gray-600">Hora</label>
          <input 
            type="time" 
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border border-gray-300 p-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-slate-50"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || !date || !time}
          className="w-full sm:w-auto bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed shadow-sm text-sm"
        >
          {isSubmitting ? "Guardando..." : "Crear"}
        </button>
      </form>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
