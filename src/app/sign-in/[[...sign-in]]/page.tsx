import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-96px)] w-full flex items-center justify-center p-4 lg:p-8">
      {/* Main Container Container with Glass/Shadow */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Left Side: Welcome & Logo (Gradient Background) */}
        <div className="relative md:flex-1 bg-gradient-to-br from-blue-600 to-indigo-800 p-6 md:p-10 lg:p-16 flex flex-col justify-between overflow-hidden text-white">
          
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[70%] aspect-square rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-[20%] -left-[10%] w-[70%] aspect-square rounded-full bg-blue-400 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4 md:mb-12">
              <div className="bg-white p-2 rounded-xl shadow-sm flex items-center justify-center">
                <Image src="/logo-unefa.png" alt="Logo Unefa" width={40} height={40} className="object-contain md:w-12 md:h-12" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-wide">SomosUnefaEE</h1>
            </div>

            <h2 className="text-center md:text-left text-2xl md:text-4xl lg:text-5xl font-extrabold md:mb-6 leading-tight">
              Bienvenido a tu <br className="hidden md:block"/>
              <span className="text-blue-200">Comunidad Universitaria</span>
            </h2>
            <p className="hidden md:block text-lg text-blue-100 mb-8 max-w-md leading-relaxed">
              Conéctate, comparte ideas, entérate de los últimos eventos y mantente en contacto con tus compañeros de la UNEFA.
            </p>
          </div>

          {/* Bottom image/graphic */}
          <div className="relative z-10 w-full max-w-[420px] aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 mt-8 hidden md:block">
            <Image 
              src="/unefa_cover.png" 
              alt="Estudiantes Unefa" 
              fill 
              className="object-cover transition-transform duration-700 hover:scale-105" 
            />
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 lg:p-16 bg-gray-50 relative">
          <div className="w-full max-w-md">
            
            <div className="flex justify-center w-full">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-xl md:shadow-none border border-transparent md:border-gray-200 w-full max-w-full rounded-2xl md:bg-white bg-transparent md:p-8",
                    headerTitle: "text-2xl font-bold text-gray-800",
                    headerSubtitle: "text-gray-500",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 shadow-md transition-all font-medium text-base",
                    formFieldInput: "rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-3",
                    formFieldLabel: "text-gray-700 font-medium mb-1",
                    footerActionLink: "text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  }
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
