"use client";

import Image from "next/image";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { updateAuthorityImage } from "@/lib/actions";

interface AuthorityCardsProps {
  initialVicerrectorImg: string;
  initialDecanaImg: string;
}

const AuthorityCards = ({ initialVicerrectorImg, initialDecanaImg }: AuthorityCardsProps) => {
  const [vicerrectorImg, setVicerrectorImg] = useState(initialVicerrectorImg);
  const [decanaImg, setDecanaImg] = useState(initialDecanaImg);

  return (
    <div className="flex flex-col gap-6 mt-8 w-full max-w-4xl mx-auto">
      
      {/* Vicerrector Card */}
      <div className="flex flex-col sm:flex-row items-center bg-white rounded-xl shadow-lg p-6 w-full relative overflow-hidden gap-6 group">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50 opacity-50 -z-10"></div>
        
        <div className="flex-shrink-0 relative w-40 h-40 rounded-full border-4 border-[#d4af37] shadow-md overflow-hidden bg-gray-200">
          <Image 
            src={vicerrectorImg} 
            alt="Vicerrector Región Occidental" 
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex flex-col flex-grow text-center sm:text-left justify-center">
          <p className="font-bold text-gray-800 text-xl md:text-2xl mb-1">Vicerrector</p>
          <p className="font-bold text-gray-800 text-xl md:text-2xl mb-4">Región Occidental</p>
          <div className="w-16 h-1 bg-blue-500 mb-4 mx-auto sm:mx-0"></div>
          <p className="font-bold text-gray-600 text-lg">G/D (RA) Jesús Antonio</p>
          <p className="font-bold text-gray-600 text-lg">Bermúdez Hernández</p>
        </div>

        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "social"}
          onSuccess={async (result: any, { widget }) => {
            const url = result.info.secure_url;
            setVicerrectorImg(url);
            try {
              await updateAuthorityImage("vicerrectorImg", url);
            } catch (error) {
              console.error(error);
            }
            widget.close();
          }}
        >
          {({ open }) => (
            <button
              onClick={() => open()}
              className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
              title="Cambiar foto del Vicerrector"
            >
              <Image src="/addimage.png" alt="Cambiar foto" width={20} height={20} />
              <span className="hidden sm:inline">Cambiar Foto</span>
            </button>
          )}
        </CldUploadWidget>
      </div>

      {/* Decana Card */}
      <div className="flex flex-col sm:flex-row items-center bg-white rounded-xl shadow-lg p-6 w-full relative overflow-hidden gap-6 group">
        <div className="absolute top-0 left-0 w-full h-full bg-[#fef8e7] opacity-30 -z-10"></div>
        
        <div className="flex-shrink-0 relative w-40 h-40 rounded-full border-4 border-[#d4af37] shadow-md overflow-hidden bg-gray-200">
          <Image 
            src={decanaImg}
            alt="Decana Núcleo Lara" 
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex flex-col flex-grow text-center sm:text-left justify-center bg-[#fef8e7] p-4 sm:p-6 rounded-lg shadow-inner">
          <p className="font-bold text-gray-800 text-lg md:text-xl">Doctora</p>
          <p className="font-bold text-gray-800 text-lg md:text-xl">Elsy Coromoto Rojas</p>
          <p className="font-bold text-gray-800 text-lg md:text-xl mb-3">Rodríguez</p>
          <p className="font-semibold text-gray-600 text-md md:text-lg">Decana Núcleo Lara</p>
        </div>

        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "social"}
          onSuccess={async (result: any, { widget }) => {
            const url = result.info.secure_url;
            setDecanaImg(url);
            try {
              await updateAuthorityImage("decanaImg", url);
            } catch (error) {
              console.error(error);
            }
            widget.close();
          }}
        >
          {({ open }) => (
            <button
              onClick={() => open()}
              className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
              title="Cambiar foto de la Decana"
            >
              <Image src="/addimage.png" alt="Cambiar foto" width={20} height={20} />
              <span className="hidden sm:inline">Cambiar Foto</span>
            </button>
          )}
        </CldUploadWidget>
      </div>

    </div>
  );
};

export default AuthorityCards;
