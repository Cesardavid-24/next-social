"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getMessages, sendMessage, markMessagesAsRead } from "@/lib/actions";
import { User } from "@prisma/client";

type Message = {
  id: number;
  content: string;
  createdAt: Date;
  isRead?: boolean;
  senderId: string;
  receiverId: string | null;
  groupChatId?: number | null;
};

export default function ChatBox({
  currentUserId,
  otherUser,
}: {
  currentUserId: string;
  otherUser: User;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch inicial y Polling cada 3 segundos
  useEffect(() => {
    let isMounted = true;

    const fetchChat = async () => {
      try {
        const data = await getMessages(otherUser.id);
        if (isMounted) {
          // Solo actualizamos el estado si hay cambios en la longitud o si es la primera vez
          // Esto evita re-renders innecesarios
          setMessages((prev) => {
            if (prev.length !== data.length) return data;
            return prev;
          });
          setIsLoading(false);
          // Marcar como leídos
          await markMessagesAsRead(otherUser.id);
        }
      } catch (err) {
        console.log("Error fetching messages", err);
      }
    };

    fetchChat();
    const interval = setInterval(fetchChat, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [otherUser.id]);

  // Auto-scroll al fondo cuando llegan mensajes nuevos
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const text = newMessage;
    setNewMessage("");

    // Actualización optimista
    const tempMessage: Message = {
      id: Math.random(),
      content: text,
      createdAt: new Date(),
      senderId: currentUserId,
      receiverId: otherUser.id,
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      await sendMessage(otherUser.id, text);
      // El polling lo actualizará con el ID real de la base de datos
    } catch (err) {
      console.log("Error sending message", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* HEADER DE CHAT */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white">
        <Image
          src={otherUser.avatar || "/noAvatar.png"}
          alt=""
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">
            {otherUser.name && otherUser.surname
              ? `${otherUser.name} ${otherUser.surname}`
              : otherUser.username}
          </span>
          <span className="text-xs text-gray-500">@{otherUser.username}</span>
        </div>
      </div>

      {/* ÁREA DE MENSAJES */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50" ref={chatContainerRef}>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 text-sm">
            Inicia la conversación enviando un mensaje.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-2xl ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* INPUT PARA ENVIAR */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-gray-200 bg-white flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-slate-100 p-3 rounded-full outline-none text-sm focus:ring-2 focus:ring-blue-100 transition-shadow"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          disabled={newMessage.trim() === ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}
