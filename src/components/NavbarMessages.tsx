"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUnreadMessages } from "@/lib/actions"; // Asumiendo que está exportada

const NavbarMessages = ({ unreadMessages: initialUnreadMessages }: { unreadMessages: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<any[]>(initialUnreadMessages);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isOpen]);

  // Polling para mensajes nuevos
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const msgs = await getUnreadMessages();
        if (msgs) {
          setUnreadMessages(msgs);
        }
      } catch (err) {
        console.error("Error fetching unread messages", err);
      }
    };

    const interval = setInterval(fetchUnreadMessages, 10000); // Polling cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  const handleMessageClick = (username: string) => {
    setIsOpen(false);
    router.push(`/messages/${username}`);
  };

  return (
    <div ref={containerRef} className="relative cursor-pointer flex flex-col items-center gap-1">
      <div className="relative" onClick={() => setIsOpen(!isOpen)}>
        <Image src="/messages.png" alt="Messages" width={20} height={20} className="w-5 h-5" />
        {unreadMessages.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            {unreadMessages.length}
          </div>
        )}
      </div>
      <span className="text-[10px] text-gray-500">Mensajes</span>

      {isOpen && (
        <div 
          className="absolute top-10 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 bg-white p-4 rounded-lg shadow-lg w-[300px] sm:w-[320px] max-w-[90vw] max-h-[400px] overflow-y-auto z-50 cursor-default border border-gray-200" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-sm text-gray-500">Mensajes Nuevos</h2>
            <Link href="/messages" className="text-xs text-blue-500 hover:underline" onClick={() => setIsOpen(false)}>
              Ver todos
            </Link>
          </div>
          
          {unreadMessages.length > 0 ? (
            <div className="flex flex-col gap-3">
              {unreadMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 rounded-md transition-colors"
                  onClick={() => handleMessageClick(msg.sender.username)}
                >
                  <Image
                    src={msg.sender.avatar || "/noAvatar.png"}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="font-semibold text-sm truncate">
                      {msg.sender.name && msg.sender.surname
                        ? `${msg.sender.name} ${msg.sender.surname}`
                        : msg.sender.username}
                    </span>
                    <span className="text-xs text-gray-500 truncate font-medium text-black">
                      {msg.content}
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-500 block text-center mt-2">No tienes mensajes nuevos.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarMessages;
