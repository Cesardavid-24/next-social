import Link from "next/link";
import Image from "next/image";
import Ad from "../Ad";

const InfoUnefaRightMenu = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="p-4 bg-white rounded-lg shadow-md text-sm text-gray-500 flex flex-col gap-2">
        <Link
          href="/info-unefa/linea-mando"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/groups.png" alt="" width={20} height={20} />
          <span>Línea de Mando</span>
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
        <Link
          href="/info-unefa/sedes"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/map.png" alt="" width={20} height={20} />
          <span>Sedes</span>
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
        <Link
          href="/info-unefa/carreras"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/school.png" alt="" width={20} height={20} />
          <span>Carreras Ofrecidas</span>
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
        <Link
          href="/info-unefa/docentes"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/people.png" alt="" width={20} height={20} />
          <span>Docentes</span>
        </Link>
      </div>
      <Ad size="sm"/>
    </div>
  );
};

export default InfoUnefaRightMenu;
