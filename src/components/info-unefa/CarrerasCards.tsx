import Image from "next/image";

const carreras = [
  {
    title: "Ingeniería Agronómica",
    icon: "/courses.png",
    color: "from-green-500 to-green-700",
    bg: "bg-green-50",
    border: "border-green-500"
  },
  {
    title: "Ingeniería de Sistemas",
    icon: "/courses.png",
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-500"
  },
  {
    title: "Ingeniería Eléctrica",
    icon: "/courses.png",
    color: "from-yellow-500 to-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-500"
  },
  {
    title: "Administración y Gestión Municipal",
    icon: "/market.png",
    color: "from-purple-500 to-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-500"
  },
  {
    title: "Economía Social",
    icon: "/market.png",
    color: "from-indigo-500 to-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-500"
  },
  {
    title: "T.S.U.: Enfermería",
    icon: "/activity.png",
    color: "from-red-500 to-red-700",
    bg: "bg-red-50",
    border: "border-red-500"
  }
];

const CarrerasCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8 w-full max-w-6xl mx-auto">
      {carreras.map((carrera, index) => (
        <div key={index} className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${carrera.color}`}></div>
          <div className={`absolute top-0 left-0 w-full h-full ${carrera.bg} opacity-30 -z-10 group-hover:opacity-50 transition-opacity`}></div>
          
          <div className={`flex items-center justify-center w-20 h-20 rounded-full border-4 ${carrera.border} shadow-md overflow-hidden bg-white mb-4`}>
            <Image 
              src={carrera.icon}
              alt={carrera.title} 
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          
          <div className="flex flex-col flex-grow text-center justify-center">
            <h3 className="font-bold text-gray-800 text-lg md:text-xl mb-2">{carrera.title}</h3>
            <div className={`w-12 h-1 bg-gradient-to-r ${carrera.color} mx-auto mt-2 rounded-full`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarrerasCards;
