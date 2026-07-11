"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getGroupMessages, sendGroupMessage } from "@/lib/actions";

type Message = {
  id: number;
  content: string;
  createdAt: Date;
  senderId: string;
  groupChatId: number | null;
  sender?: {
    id: string;
    username: string;
    name: string | null;
    surname: string | null;
    avatar: string | null;
  };
};

export default function GroupChatBox({
  currentUserId,
  groupChat,
}: {
  currentUserId: string;
  groupChat: {
    id: number;
    name: string;
    img: string | null;
    members: any[];
  };
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchChat = async () => {
      try {
        const data = await getGroupMessages(groupChat.id);
        if (isMounted) {
          setMessages((prev) => {
            if (prev.length !== data.length) return data as unknown as Message[];
            return prev;
          });
          setIsLoading(false);
        }
      } catch (err) {
        console.log("Error fetching group messages", err);
      }
    };

    fetchChat();
    const interval = setInterval(fetchChat, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [groupChat.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const text = newMessage;
    setNewMessage("");

    // Optimistic update
    const tempMessage: Message = {
      id: Math.random(),
      content: text,
      createdAt: new Date(),
      senderId: currentUserId,
      groupChatId: groupChat.id,
      sender: {
        id: currentUserId,
        username: "Tú",
        name: null,
        surname: null,
        avatar: "/noAvatar.png" // No tenemos el avatar del current user aquí, pero es para update optimista
      }
    };
    
    setMessages((prev) => [...prev, tempMessage]);

    try {
      await sendGroupMessage(groupChat.id, text);
    } catch (err) {
      console.log("Error sending group message", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* CHAT HEADER */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
          {groupChat.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{groupChat.name}</span>
          <span className="text-xs text-gray-500">{groupChat.members.length} miembros</span>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 text-sm">
            Inicia la conversación enviando un mensaje al grupo.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && msg.sender && (
                  <Image
                    src={msg.sender.avatar || "/noAvatar.png"}
                    alt=""
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover mr-2 self-end mb-1"
                  />
                )}
                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  {!isMe && msg.sender && (
                    <span className="text-[10px] text-gray-500 ml-1 mb-1">{msg.sender.username}</span>
                  )}
                  <div
                    className={`max-w-[100%] p-3 rounded-2xl ${
                      isMe
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* SEND INPUT */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-gray-200 bg-white flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="Escribe un mensaje al grupo..."
          className="flex-1 bg-slate-100 p-3 rounded-full outline-none text-sm focus:ring-2 focus:ring-blue-100 transition-shadow text-gray-800"
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
