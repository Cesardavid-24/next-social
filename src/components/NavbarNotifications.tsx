"use client";

import Image from "next/image";
import { useState } from "react";
import FriendRequestList from "./rightMenu/FriendRequestList";
import { FollowRequest, User } from "@prisma/client";

type RequestWithUser = FollowRequest & {
  sender: User;
};

const NavbarNotifications = ({ requests }: { requests: RequestWithUser[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative cursor-pointer flex flex-col items-center gap-1" onClick={() => setIsOpen(!isOpen)}>
      <div className="relative">
        <Image src="/notifications.png" alt="Notifications" width={20} height={20} className="w-5 h-5" />
        {requests.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            {requests.length}
          </div>
        )}
      </div>
      <span className="text-[10px] text-gray-500">Notificaciones</span>
      
      {isOpen && (
        <div className="absolute top-10 right-0 bg-white p-4 rounded-lg shadow-lg w-[320px] max-h-[400px] overflow-y-auto z-50 cursor-default border border-gray-200" onClick={(e) => e.stopPropagation()}>
          <h2 className="font-semibold text-sm mb-4 text-gray-500">Notificaciones</h2>
          {requests.length > 0 ? (
            <FriendRequestList requests={requests} />
          ) : (
            <span className="text-xs text-gray-500">No tienes notificaciones.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarNotifications;
