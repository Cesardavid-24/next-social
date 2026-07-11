"use client";

import Image from "next/image";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { updateAuthorityImage } from "@/lib/actions";

interface DocentesCardsProps {
  initialDocente1Img: string;
  initialDocente2Img: string;
}

const DocentesCards = ({ initialDocente1Img, initialDocente2Img }: DocentesCardsProps) => {
  const [docente1Img, setDocente1Img] = useState(initialDocente1Img);
  const [docente2Img, setDocente2Img] = useState(initialDocente2Img);

  return (
    <div className="flex flex-col gap-6 mt-8 w-full max-w-4xl mx-auto">
      
      {/* Docente 1 Card */}
      <div className="flex flex-col sm:flex-row items-center bg-white rounded-xl shadow-lg p-6 w-full relative overflow-hidden gap-6 group">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50 opacity-50 -z-10"></div>
        
        <div className="flex-shrink-0 relative w-40 h-40 rounded-full border-4 border-[#10b981] shadow-md overflow-hidden bg-gray-200">
          <Image 
            src={docente1Img} 
            alt="Docente" 
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex flex-col flex-grow text-center sm:text-left justify-center">
          <p className="font-bold text-gray-800 text-xl md:text-2xl mb-1">Docente Principal</p>
          <p className="font-bold text-gray-800 text-xl md:text-2xl mb-4">Ingeniería</p>
          <div className="w-16 h-1 bg-green-500 mb-4 mx-auto sm:mx-0"></div>
          <p className="font-bold text-gray-600 text-lg">Nombre del Docente</p>
          <p className="font-bold text-gray-600 text-lg">Apellido del Docente</p>
        </div>

        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "social"}
          onSuccess={async (result: any, { widget }) => {
            const url = result.info.secure_url;
            setDocente1Img(url);
            try {
              await updateAuthorityImage("docente1Img", url);
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
              title="Cambiar foto del Docente"
            >
              <Image src="/addimage.png" alt="Cambiar foto" width={20} height={20} />
              <span className="hidden sm:inline">Cambiar Foto</span>
            </button>
          )}
        </CldUploadWidget>
      </div>

      {/* Docente 2 Card */}
      <div className="flex flex-col sm:flex-row items-center bg-white rounded-xl shadow-lg p-6 w-full relative overflow-hidden gap-6 group">
        <div className="absolute top-0 left-0 w-full h-full bg-[#f0fdf4] opacity-30 -z-10"></div>
        
        <div className="flex-shrink-0 relative w-40 h-40 rounded-full border-4 border-[#10b981] shadow-md overflow-hidden bg-gray-200">
          <Image 
            src={docente2Img}
            alt="Docente" 
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex flex-col flex-grow text-center sm:text-left justify-center bg-[#f0fdf4] p-4 sm:p-6 rounded-lg shadow-inner">
          <p className="font-bold text-gray-800 text-lg md:text-xl">Docente Principal</p>
          <p className="font-bold text-gray-800 text-lg md:text-xl">Enfermería</p>
          <div className="w-16 h-1 bg-green-500 mb-4 mx-auto sm:mx-0"></div>
          <p className="font-semibold text-gray-600 text-md md:text-lg">Nombre del Docente</p>
          <p className="font-semibold text-gray-600 text-md md:text-lg">Apellido del Docente</p>
        </div>

        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "social"}
          onSuccess={async (result: any, { widget }) => {
            const url = result.info.secure_url;
            setDocente2Img(url);
            try {
              await updateAuthorityImage("docente2Img", url);
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
              title="Cambiar foto del Docente"
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

export default DocentesCards;
