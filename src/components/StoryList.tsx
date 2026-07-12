"use client";

import { addStory, deleteStory } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { Story, User } from "@prisma/client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useOptimistic, useState, useEffect } from "react";

type StoryWithUser = Story & {
  user: User;
};

const StoryList = ({
  stories,
  userId,
  isNavbar = false,
}: {
  stories: StoryWithUser[];
  userId: string;
  isNavbar?: boolean;
}) => {
  const [storyList, setStoryList] = useState(stories);
  const [img, setImg] = useState<any>();
  const [activeStoryGroup, setActiveStoryGroup] = useState<StoryWithUser[] | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (activeStoryGroup && activeStoryGroup.length > 0) {
      const timer = setTimeout(() => {
        if (currentStoryIndex < activeStoryGroup.length - 1) {
          setCurrentStoryIndex((prev) => prev + 1);
        } else {
          setActiveStoryGroup(null);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeStoryGroup, currentStoryIndex]);

  const add = async () => {
    if (!img?.secure_url) return;

    addOptimisticStory({
      id: Math.random(),
      img: img.secure_url,
      createdAt: new Date(Date.now()),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: userId,
      user: {
        id: userId,
        username: "Enviando...",
        avatar: user?.imageUrl || "/noAvatar.png",
        cover: "",
        description: "",
        name: "",
        surname: "",
        city: "",
        work: "",
        school: "",
        website: "",
        createdAt: new Date(Date.now()),
      },
    });

    try {
      const createdStory = await addStory(img.secure_url);
      if (createdStory) {
        setStoryList((prev) => [...prev, createdStory]);
      }
      setImg(null);
    } catch (err) {}
  };

  const handleDelete = async (storyId: number) => {
    // Optimistic deletion
    setStoryList((prev) => prev.filter((s) => s.id !== storyId));
    
    // Update modal state
    if (activeStoryGroup && activeStoryGroup.length === 1) {
      setActiveStoryGroup(null);
    } else if (activeStoryGroup) {
      const updatedGroup = activeStoryGroup.filter((s) => s.id !== storyId);
      setActiveStoryGroup(updatedGroup);
      if (currentStoryIndex >= updatedGroup.length) {
        setCurrentStoryIndex(updatedGroup.length - 1);
      }
    }

    try {
      await deleteStory(storyId);
    } catch (err) {}
  };

  const [optimisticStories, addOptimisticStory] = useOptimistic(
    storyList,
    (state, value: StoryWithUser) => [...state, value]
  );

  // Agrupar historias por usuario
  const userStoriesMap = new Map<string, StoryWithUser[]>();
  
  optimisticStories.forEach((s) => {
    if (!userStoriesMap.has(s.userId)) {
      userStoriesMap.set(s.userId, []);
    }
    userStoriesMap.get(s.userId)!.push(s);
  });

  // Ordenar historias dentro del grupo por fecha de creación ascendente
  const groupedStories = Array.from(userStoriesMap.values()).map(group => 
    group.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  );

  return (
    <>
      <style>{`
        @keyframes storyProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>

      {!isNavbar && (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "social"}
          onSuccess={(result, { widget }) => {
            setImg(result.info);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <div className="flex flex-col items-center gap-2 cursor-pointer relative shrink-0">
                <Image
                  src={img?.secure_url || user?.imageUrl || "/noAvatar.png"}
                  alt=""
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full ring-2 object-cover"
                  onClick={() => open()}
                />
                {img ? (
                  <button 
                    type="button"
                    onClick={add}
                    className="text-xs bg-blue-500 p-1 rounded-md text-white animate-pulse cursor-pointer z-10"
                  >
                    Enviar
                  </button>
                ) : (
                  <span className="font-medium text-sm" onClick={() => open()}>Añadir Historia</span>
                )}
                <div className="absolute text-6xl text-gray-200 top-1 pointer-events-none">+</div>
              </div>
            );
          }}
        </CldUploadWidget>
      )}
      
      {/* STORY BUBBLES */}
      {groupedStories.map((userStoryGroup) => {
        // Usamos la primera (o última) historia como portada de la burbuja
        const representativeStory = userStoryGroup[userStoryGroup.length - 1];
        return (
          <div
            className="flex flex-col items-center gap-2 cursor-pointer shrink-0"
            key={representativeStory.userId}
            onClick={() => {
              if (representativeStory.user.username !== "Enviando...") {
                setActiveStoryGroup(userStoryGroup);
                setCurrentStoryIndex(0);
              }
            }}
          >
            <div className="relative">
              <Image
                src={representativeStory.user.avatar || "/noAvatar.png"}
                alt=""
                width={80}
                height={80}
                className="w-20 h-20 rounded-full ring-4 ring-blue-500 p-1 object-cover"
              />
            </div>
            <span className="font-medium text-sm truncate max-w-[80px]">
              {representativeStory.user.name || representativeStory.user.username}
            </span>
          </div>
        );
      })}

      {/* STORY MODAL */}
      {activeStoryGroup && activeStoryGroup.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-[100] transition-all duration-300"
          onClick={() => setActiveStoryGroup(null)}
        >
          <div 
            className="relative w-full max-w-md h-[80vh] flex flex-col items-center justify-center p-4 bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress bars */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
              {activeStoryGroup.map((s, idx) => (
                <div key={s.id} className="h-1 flex-1 bg-gray-500/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-white rounded-full ${
                      idx === currentStoryIndex 
                        ? 'animate-[storyProgress_5s_linear_forwards]' 
                        : idx < currentStoryIndex 
                          ? 'w-full' 
                          : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Top user bar inside modal */}
            <div className="absolute top-8 left-4 flex items-center gap-3 text-white z-20 w-full pr-8">
              <Image
                src={activeStoryGroup[currentStoryIndex].user.avatar || "/noAvatar.png"}
                alt=""
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-white/50"
              />
              <span className="font-semibold text-sm drop-shadow-md">
                {activeStoryGroup[currentStoryIndex].user.name && activeStoryGroup[currentStoryIndex].user.surname
                  ? activeStoryGroup[currentStoryIndex].user.name + " " + activeStoryGroup[currentStoryIndex].user.surname
                  : activeStoryGroup[currentStoryIndex].user.username}
              </span>

              {/* Close Button */}
              <button
                onClick={() => setActiveStoryGroup(null)}
                className="ml-auto text-white hover:text-gray-300 bg-black/30 p-2 rounded-full transition-colors"
                title="Cerrar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Delete button (only if it's my story) */}
            {activeStoryGroup[currentStoryIndex].userId === userId && (
              <div className="absolute top-8 right-16 z-20">
                <button
                  onClick={() => handleDelete(activeStoryGroup[currentStoryIndex].id)}
                  className="text-white hover:text-red-500 bg-black/30 p-2 rounded-full transition-colors"
                  title="Eliminar historia"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            )}

            {/* Navigation controls */}
            <div className="absolute inset-0 flex z-10">
              <div 
                className="w-1/3 h-full cursor-pointer" 
                onClick={() => {
                  if (currentStoryIndex > 0) {
                    setCurrentStoryIndex(prev => prev - 1);
                  } else {
                    // Si ya está en la primera, podríamos cerrar o mantener.
                    // Para Instagram, retroceder en la primera historia va a la historia del usuario anterior.
                    // Aquí simplemente reiniciamos la animación.
                    setCurrentStoryIndex(0);
                  }
                }}
              />
              <div 
                className="w-2/3 h-full cursor-pointer" 
                onClick={() => {
                  if (currentStoryIndex < activeStoryGroup.length - 1) {
                    setCurrentStoryIndex(prev => prev + 1);
                  } else {
                    setActiveStoryGroup(null);
                  }
                }}
              />
            </div>

            {/* Story Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={activeStoryGroup[currentStoryIndex].img}
                alt="Story"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryList;
