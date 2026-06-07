"use client";

import { addStory } from "@/lib/actions";
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
}: {
  stories: StoryWithUser[];
  userId: string;
}) => {
  const [storyList, setStoryList] = useState(stories);
  const [img, setImg] = useState<any>();
  const [activeStory, setActiveStory] = useState<StoryWithUser | null>(null);

  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (activeStory) {
      const timer = setTimeout(() => {
        setActiveStory(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeStory]);

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
        username: "Sending...",
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
        setStoryList((prev) => [
          createdStory,
          ...prev.filter((story) => story.userId !== userId),
        ]);
      }
      setImg(null);
    } catch (err) {}
  };

  const [optimisticStories, addOptimisticStory] = useOptimistic(
    storyList,
    (state, value: StoryWithUser) => [
      value,
      ...state.filter((story) => story.userId !== value.userId),
    ]
  );

  return (
    <>
      <style>{`
        @keyframes storyProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "social"}
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div className="flex flex-col items-center gap-2 cursor-pointer relative">
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
                  Send
                </button>
              ) : (
                <span className="font-medium" onClick={() => open()}>Add a Story</span>
              )}
              <div className="absolute text-6xl text-gray-200 top-1 pointer-events-none">+</div>
            </div>
          );
        }}
      </CldUploadWidget>
      {/* STORY */}
      {optimisticStories.map((story) => (
        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          key={story.id}
          onClick={() => {
            if (story.user.username !== "Sending...") {
              setActiveStory(story);
            }
          }}
        >
          <Image
            src={story.user.avatar || "/noAvatar.png"}
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2 object-cover"
          />
          <span className="font-medium">
            {story.user.name || story.user.username}
          </span>
        </div>
      ))}

      {/* STORY MODAL */}
      {activeStory && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center z-50 transition-all duration-300"
          onClick={() => setActiveStory(null)}
        >
          <div 
            className="relative w-full max-w-md h-[75vh] flex flex-col items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top user bar inside modal */}
            <div className="absolute top-6 left-6 flex items-center gap-3 text-white z-10 bg-black/30 p-2 rounded-lg backdrop-blur-sm">
              <Image
                src={activeStory.user.avatar || "/noAvatar.png"}
                alt=""
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500"
              />
              <span className="font-semibold text-sm drop-shadow-md">
                {activeStory.user.name && activeStory.user.surname
                  ? activeStory.user.name + " " + activeStory.user.surname
                  : activeStory.user.username}
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-6 right-6 text-white bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold transition-all border border-white/20 z-10 shadow-lg"
            >
              ✕
            </button>

            {/* Story Image */}
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black flex items-center justify-center">
              <Image
                src={activeStory.img}
                alt="Story"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Progress bar animation indicator */}
            <div className="absolute bottom-6 left-6 right-6 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-[storyProgress_5s_linear_forwards]" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryList;
