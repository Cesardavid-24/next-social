"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import FriendRequestList from "./rightMenu/FriendRequestList";
import { FollowRequest, User } from "@prisma/client";
import { getNotifications, markNotificationsAsRead } from "@/lib/actions";
import * as timeago from "timeago.js";

// Opcional: configurar locale si timeago.js lo soporta directo, sino por defecto.

type RequestWithUser = FollowRequest & {
  sender: User;
};

const NavbarNotifications = ({ requests }: { requests: RequestWithUser[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activityNotifications, setActivityNotifications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"activity" | "requests">("activity");

  const unreadActivityCount = activityNotifications.filter((n) => !n.isRead).length;
  const unreadCount = unreadActivityCount + requests.length;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isOpen]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifs = await getNotifications();
        setActivityNotifications(notifs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Polling cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadActivityCount > 0) {
      try {
        await markNotificationsAsRead();
        setActivityNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch (err) {}
    }
  };

  const getNotificationText = (type: string) => {
    switch (type) {
      case "POST_LIKE":
        return "le dio me gusta a tu publicación.";
      case "POST_COMMENT":
        return "comentó en tu publicación.";
      case "COMMENT_LIKE":
        return "le dio me gusta a tu comentario.";
      case "COMMENT_REPLY":
        return "respondió a tu comentario.";
      default:
        return "interactuó contigo.";
    }
  };

  return (
    <div ref={containerRef} className="relative cursor-pointer flex flex-col items-center gap-1" onClick={handleOpen}>
      <div className="relative">
        <Image src="/notifications.png" alt="Notifications" width={20} height={20} className="w-5 h-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            {unreadCount}
          </div>
        )}
      </div>
      <span className="text-[10px] text-gray-500">Notificaciones</span>

      {isOpen && (
        <div
          className="absolute top-10 right-0 bg-white p-4 rounded-lg shadow-lg w-[350px] max-h-[400px] overflow-y-auto z-50 cursor-default border border-gray-200 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-4 mb-4 border-b pb-2">
            <button
              className={`font-semibold text-sm relative ${activeTab === "activity" ? "text-blue-500" : "text-gray-500"}`}
              onClick={() => setActiveTab("activity")}
            >
              Actividad
              {unreadActivityCount > 0 && activeTab !== "activity" && (
                <span className="absolute -top-1 -right-3 bg-red-500 rounded-full w-2 h-2"></span>
              )}
            </button>
            <button
              className={`font-semibold text-sm flex items-center gap-1 ${activeTab === "requests" ? "text-blue-500" : "text-gray-500"}`}
              onClick={() => setActiveTab("requests")}
            >
              Solicitudes
              {requests.length > 0 && (
                <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {requests.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === "requests" ? (
            requests.length > 0 ? (
              <FriendRequestList requests={requests} />
            ) : (
              <span className="text-xs text-gray-500">No tienes solicitudes pendientes.</span>
            )
          ) : activityNotifications.length > 0 ? (
            <div className="flex flex-col gap-4">
              {activityNotifications.map((notif) => (
                <div key={notif.id} className={`flex items-center gap-4 ${!notif.isRead ? "bg-blue-50 p-2 rounded-lg" : ""}`}>
                  <Image
                    src={notif.sender.avatar || "/noAvatar.png"}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="text-sm">
                      <span className="font-semibold mr-1">
                        {notif.sender.name && notif.sender.surname
                          ? `${notif.sender.name} ${notif.sender.surname}`
                          : notif.sender.username}
                      </span>
                      {getNotificationText(notif.type)}
                    </span>
                    <span className="text-xs text-gray-500">{timeago.format(notif.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-500">No tienes notificaciones nuevas.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarNotifications;
