import Image from "next/image";

const SedesInfo = () => {
  return (
    <div className="flex flex-col gap-6 mt-8 w-full max-w-4xl mx-auto">
      
      <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 w-full relative overflow-hidden gap-6 group">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50 opacity-50 -z-10"></div>
        
        <div className="w-full relative h-64 md:h-96 rounded-lg overflow-hidden shadow-md border-4 border-white">
          <Image 
            src="/Unefa 25.jpeg" 
            alt="Sede UNEFA 25" 
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="flex flex-col w-full text-center sm:text-left bg-slate-50 p-6 rounded-lg shadow-inner">
          <h2 className="font-bold text-gray-800 text-2xl mb-2 text-center">Núcleo Lara - Sede Principal</h2>
          <div className="w-16 h-1 bg-blue-500 mb-6 mx-auto"></div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-gray-700 text-lg md:text-xl font-medium bg-white p-4 rounded-xl shadow-sm">
            <Image src="/map.png" alt="Ubicación" width={28} height={28} className="flex-shrink-0" />
            <p className="text-center">Carrera 19 Esquina calle 25 Frente al Teatro Juarez</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SedesInfo;
