"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import StoryList from "./StoryList";

const NavbarStories = ({
  stories,
  userId,
}: {
  stories: any[];
  userId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isOpen]);

  // Close when route changes (clicking other nav items)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className="relative cursor-pointer flex items-center gap-2"
      onClick={() => setIsOpen(!isOpen)}
    >
      <Image
        src="/stories.png"
        alt="Stories"
        width={16}
        height={16}
        className="w-4 h-4"
      />
      <span>Historias</span>
      
      {isOpen && (
        <div className="absolute top-10 left-0 bg-white p-4 rounded-lg shadow-lg w-[350px] max-h-[400px] overflow-y-auto z-50 cursor-default border border-gray-200" onClick={(e) => e.stopPropagation()}>
          <h2 className="font-semibold text-sm mb-4 text-gray-500">Historias</h2>
          {stories.length > 0 ? (
             <div className="flex gap-4 overflow-x-auto scrollbar-hide">
               <StoryList stories={stories} userId={userId} isNavbar={true} />
             </div>
          ) : (
            <span className="text-xs text-gray-500">No hay historias disponibles.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarStories;
