import Image from "next/image";
import Link from "next/link";

const GroupRightMenu = ({ memberCount = 0 }: { memberCount?: number }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* GROUP INFO */}
      <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
        {/* TOP */}
        <div className="flex justify-between items-center font-medium">
          <span className="text-gray-500">Acerca de este Grupo</span>
        </div>
        {/* BOTTOM */}
        <div className="flex flex-col gap-4 text-gray-500">
          <p>
            Bienvenido al grupo oficial de <b>Red Unefa</b>. Un lugar para compartir fotos, videos, encuestas y todo el contenido relacionado con nuestra comunidad universitaria.
          </p>
          <div className="flex items-center gap-2">
            <Image src="/date.png" alt="" width={16} height={16} />
            <span>Creado en Junio 2026</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <span className="font-bold text-gray-700">Público</span>
            </div>
            <div className="flex gap-1 items-center">
              <span className="font-bold text-gray-700">{memberCount}</span>
              <span>Miembros</span>
            </div>
          </div>
          <Link href="/" className="text-blue-500 text-xs">
            Saber más sobre Grupos
          </Link>
        </div>
      </div>

      {/* MEDIA PREVIEW */}
      <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
        <div className="flex justify-between items-center font-medium">
          <span className="text-gray-500">Multimedia del Grupo</span>
          <Link href="/" className="text-blue-500 text-xs">
            Ver todo
          </Link>
        </div>
        <div className="flex gap-4 justify-between flex-wrap">
          {/* Mock images for media section */}
          <div className="relative w-1/5 h-24">
            <Image
              src="https://images.pexels.com/photos/1739842/pexels-photo-1739842.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt=""
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="relative w-1/5 h-24">
            <Image
              src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt=""
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="relative w-1/5 h-24">
            <Image
              src="https://images.pexels.com/photos/340152/pexels-photo-340152.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt=""
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="relative w-1/5 h-24">
            <Image
              src="https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt=""
              fill
              className="object-cover rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupRightMenu;
