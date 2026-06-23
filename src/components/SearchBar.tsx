"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { searchUsers } from "@/lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserResult = {
  id: string;
  username: string;
  name: string | null;
  surname: string | null;
  avatar: string | null;
  score: number;
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cerrar el dropdown si se hace clic fuera del buscador
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (query.trim().length === 0) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      const data = await searchUsers(query);
      setResults(data);
      setIsOpen(true);
      setIsLoading(false);
    };

    // Usamos un pequeño debounce para no saturar el servidor con cada tecla
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelectUser = (username: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/profile/${username}`);
  };

  return (
    <div ref={wrapperRef} className="relative hidden xl:flex items-center w-[300px]">
      <div className="flex w-full p-2 bg-slate-100 items-center rounded-xl">
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-transparent outline-none w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
        {isLoading ? (
          <div className="w-3 h-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
        ) : (
          <Image src="/search.png" alt="" width={14} height={14} />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-12 left-0 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden flex flex-col">
          {results.length > 0 ? (
            results.map((user) => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user.username)}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <Image
                  src={user.avatar || "/noAvatar.png"}
                  alt=""
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {user.name && user.surname ? `${user.name} ${user.surname}` : user.username}
                  </span>
                  <span className="text-xs text-gray-500">@{user.username}</span>
                </div>
                {/* Opcional: mostrar la relevancia para la presentación */}
                <span className="ml-auto text-[10px] text-gray-400">Score: {Math.round(user.score)}</span>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">No se encontraron usuarios</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
