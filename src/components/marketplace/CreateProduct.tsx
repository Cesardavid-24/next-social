"use client";

import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { createProduct } from "@/lib/actions";
import { useRouter } from "next/navigation";

const CreateProduct = () => {
  const [img, setImg] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!img) {
      alert("Por favor sube una imagen del producto");
      return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createProduct(formData, img.secure_url);
      setIsOpen(false);
      setImg(null);
      router.refresh();
    } catch (err) {
      console.log(err);
      alert("Hubo un error al crear la publicación");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md flex items-center gap-2"
      >
        <Image src="/addimage.png" alt="Add" width={20} height={20} className="invert" />
        Vender un artículo
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          X
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Publicar un artículo</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Título</label>
            <input 
              name="title" 
              required 
              type="text" 
              placeholder="Ej: Calculadora Científica" 
              className="border rounded-md p-2 text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Descripción</label>
            <textarea 
              name="description" 
              required 
              rows={3}
              placeholder="Estado del artículo, detalles..." 
              className="border rounded-md p-2 text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Precio ($)</label>
            <input 
              name="price" 
              required 
              type="number" 
              step="0.01"
              min="0"
              placeholder="Ej: 15.50" 
              className="border rounded-md p-2 text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Categoría</label>
            <select name="category" required className="border rounded-md p-2 bg-white text-gray-800">
              <option value="Libros">Libros</option>
              <option value="Electrónica">Electrónica</option>
              <option value="Ropa">Ropa</option>
              <option value="Servicios">Servicios</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-sm font-semibold text-gray-700">Foto del artículo</label>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "social"}
              onSuccess={(result) => setImg(result.info)}
            >
              {({ open }) => (
                <div 
                  onClick={() => open()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {img ? (
                    <Image src={img.secure_url} alt="Vista previa" width={100} height={100} className="object-cover rounded-md" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <Image src="/addimage.png" alt="" width={24} height={24} />
                      <span className="text-sm mt-2">Haz clic para subir foto</span>
                    </div>
                  )}
                </div>
              )}
            </CldUploadWidget>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-blue-500 text-white font-semibold rounded-lg p-3 mt-4 hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Publicando..." : "Publicar Artículo"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
