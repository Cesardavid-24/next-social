import Link from "next/link";

const UnderConstruction = ({ title = "Página en Construcción" }: { title?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="text-8xl mb-6 animate-bounce">
        🚧
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        {title}
      </h1>
      <p className="text-gray-500 text-lg md:text-xl max-w-lg mb-8">
        Estamos trabajando duro para traerte esta sección muy pronto. ¡Vuelve más tarde para ver las novedades! 🚀
      </p>
      <Link 
        href="/" 
        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default UnderConstruction;
