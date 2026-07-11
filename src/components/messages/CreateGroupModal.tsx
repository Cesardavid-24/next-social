"use client";

import { useState } from "react";
import Image from "next/image";
import { searchUsers, createGroupChat } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function CreateGroupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 1) {
      setIsSearching(true);
      const results = await searchUsers(query);
      setSearchResults(results.filter(u => !selectedUsers.find(su => su.id === u.id)));
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const selectUser = (user: any) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
      setSearchResults(searchResults.filter(u => u.id !== user.id));
    }
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const chat = await createGroupChat(groupName, selectedUsers.map(u => u.id));
      setIsOpen(false);
      setGroupName("");
      setSelectedUsers([]);
      setSearchQuery("");
      router.push(`/messages/group/${chat.id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-blue-50 text-blue-600 border border-blue-200 p-2 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm mb-4"
      >
        <span>➕ Crear Grupo</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b flex items-center justify-between bg-slate-50">
          <h2 className="font-bold text-lg text-gray-800">Crear Chat Grupal</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">✖</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Nombre del Grupo</label>
            <input 
              type="text" 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ej. Proyecto de Grado" 
              className="border p-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Añadir Participantes</label>
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Buscar usuarios..." 
              className="border p-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            {isSearching && <span className="text-xs text-gray-400 mt-1">Buscando...</span>}
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 border rounded-md max-h-32 overflow-y-auto bg-white shadow-sm">
                {searchResults.map(user => (
                  <div 
                    key={user.id} 
                    onClick={() => selectUser(user)}
                    className="flex items-center gap-2 p-2 hover:bg-slate-100 cursor-pointer border-b last:border-0"
                  >
                    <Image src={user.avatar || "/noAvatar.png"} alt="" width={24} height={24} className="rounded-full w-6 h-6 object-cover" />
                    <span className="text-sm text-gray-700">{user.username}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-semibold text-gray-500 uppercase">Seleccionados ({selectedUsers.length})</span>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map(user => (
                  <div key={user.id} className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <span>{user.username}</span>
                    <button type="button" onClick={() => removeUser(user.id)} className="text-blue-500 hover:text-blue-800">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting || !groupName.trim() || selectedUsers.length === 0}
            className="mt-4 bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creando..." : "Crear Grupo"}
          </button>
        </form>
      </div>
    </div>
  );
}
