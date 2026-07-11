import LeftMenu from "@/components/leftMenu/LeftMenu";
import InfoUnefaRightMenu from "@/components/rightMenu/InfoUnefaRightMenu";
import SedesInfo from "@/components/info-unefa/SedesInfo";

const SedesPage = () => {
  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>

      <div className="w-full lg:w-[70%] xl:w-[60%] mx-auto">
        <div className="flex flex-col gap-6">
          {/* HEADER / BANNER */}
          <div className="bg-gradient-to-r from-cyan-700 to-cyan-500 rounded-lg shadow-md p-8 text-white flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col justify-center text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-2">Nuestras Sedes</h1>
              <p className="text-cyan-100 max-w-2xl">
                Conoce nuestras instalaciones y la ubicación estratégica de nuestros núcleos, pensados para brindar el mejor ambiente universitario.
              </p>
            </div>
          </div>

          {/* SEDES INFO */}
          <SedesInfo />

        </div>
      </div>

      <div className="hidden lg:block w-[10%] xl:w-[20%]">
        <InfoUnefaRightMenu />
      </div>
    </div>
  );
};

export default SedesPage;
