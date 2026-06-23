"use client";

import { useUser } from "@clerk/nextjs";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import AddPostButton from "./AddPostButton";
import { addPost } from "@/lib/actions";

const AddPost = ({ groupId }: { groupId?: string }) => {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<any>();
  const [showPoll, setShowPoll] = useState(false);
  const [pollTitle, setPollTitle] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  if (!isLoaded) {
    return "Loading...";
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={user?.imageUrl || "/noAvatar.png"}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT INPUT */}
        <form 
          action={async (formData) => {
            const validOptions = pollOptions.filter(opt => opt.trim() !== "");
            if (showPoll && validOptions.length >= 2) {
              formData.set("pollOptions", JSON.stringify(validOptions));
              if (pollTitle.trim()) {
                formData.set("pollTitle", pollTitle.trim());
              }
            }
            await addPost(formData, img?.secure_url || "", groupId);
            setDesc("");
            setImg(null);
            setShowPoll(false);
            setPollTitle("");
            setPollOptions(["", ""]);
            // Optionally, we could reset the form manually if needed
          }} 
          className="flex gap-4"
        >
          <div className="flex-1">
            <textarea
              placeholder="¿Qué estás pensando?"
              className="w-full bg-slate-100 rounded-lg p-2"
              name="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>
            {img && (
              <div className="relative mt-2 w-32 h-32">
                <Image src={img.secure_url} alt="preview" fill className="object-cover rounded-md" />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() => setImg(null)}
                >
                  ✕
                </button>
              </div>
            )}
            {showPoll && (
              <div className="mt-4 flex flex-col gap-2 border border-slate-200 p-4 rounded-lg">
                <div className="text-sm font-semibold text-gray-600 flex justify-between">
                  <span>Encuesta</span>
                  <button type="button" onClick={() => setShowPoll(false)} className="text-red-500">✕</button>
                </div>
                <input
                  type="text"
                  placeholder="Haz una pregunta..."
                  className="w-full bg-slate-100 rounded-lg p-2 text-sm font-medium mb-2"
                  value={pollTitle}
                  onChange={(e) => setPollTitle(e.target.value)}
                />
                {pollOptions.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Opción ${i + 1}`}
                    className="w-full bg-slate-100 rounded-lg p-2 text-sm"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...pollOptions];
                      newOpts[i] = e.target.value;
                      setPollOptions(newOpts);
                    }}
                  />
                ))}
                {pollOptions.length < 4 && (
                  <button
                    type="button"
                    className="text-blue-500 text-sm mt-2 text-left"
                    onClick={() => setPollOptions([...pollOptions, ""])}
                  >
                    + Añadir Opción
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Image
              src="/emoji.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer self-end"
            />
            <AddPostButton />
          </div>
        </form>
        {/* POST OPTIONS */}
        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "social"}
            onSuccess={(result, { widget }) => {
              setImg(result.info);
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image src="/addimage.png" alt="" width={20} height={20} />
                  Foto
                </div>
              );
            }}
          </CldUploadWidget>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addVideo.png" alt="" width={20} height={20} />
            Video
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowPoll(true)}
          >
            <Image src="/poll.png" alt="" width={20} height={20} />
            Encuesta
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addevent.png" alt="" width={20} height={20} />
            Evento
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
