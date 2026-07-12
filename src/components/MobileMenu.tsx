"use client";

import Link from "next/link";
import { useState } from "react";
import NavbarMessages from "./NavbarMessages";
import NavbarNotifications from "./NavbarNotifications";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";

const MobileMenu = ({ unreadMessages = [], requests = [] }: { unreadMessages?: any[], requests?: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="md:hidden">
      <div
        className="flex flex-col gap-[4.5px] cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "rotate-45 translate-y-[8.5px]" : ""
          } origin-left ease-in-out duration-500`}
        />
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "opacity-0" : ""
          } ease-in-out duration-500`}
        />
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "-rotate-45 -translate-y-[8.5px]" : ""
          } origin-left ease-in-out duration-500`}
        />
      </div>
      {isOpen && (
        <div className="absolute left-0 top-24 w-full h-[calc(100vh-96px)] bg-white flex flex-col items-center justify-center gap-8 font-medium text-xl z-50">
          <Link href="/" onClick={() => setIsOpen(false)}>Inicio</Link>
          <Link href="/friends" onClick={() => setIsOpen(false)}>Amigos</Link>
          <Link href="/people" onClick={() => setIsOpen(false)}>Personas</Link>
          
          <SignedIn>
            <div className="flex items-center gap-6 mt-4">
              <NavbarMessages unreadMessages={unreadMessages} />
              <NavbarNotifications requests={requests} />
              <UserButton />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex flex-col items-center gap-4 mt-4">
              <Link href="/sign-in" className="text-blue-600" onClick={() => setIsOpen(false)}>Iniciar Sesión</Link>
              <Link href="/sign-up" className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={() => setIsOpen(false)}>Registrarse</Link>
            </div>
          </SignedOut>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
