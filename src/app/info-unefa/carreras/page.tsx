import LeftMenu from "@/components/leftMenu/LeftMenu";
import InfoUnefaRightMenu from "@/components/rightMenu/InfoUnefaRightMenu";
import CarrerasCards from "@/components/info-unefa/CarrerasCards";

const CarrerasPage = () => {
  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>

      <div className="w-full lg:w-[70%] xl:w-[60%] mx-auto">
        <div className="flex flex-col gap-6">
          {/* HEADER / BANNER */}
          <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-lg shadow-md p-8 text-white flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col justify-center text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-2">Carreras Ofrecidas</h1>
              <p className="text-indigo-100 max-w-2xl">
                Descubre nuestra oferta académica, diseñada para formar profesionales de excelencia con un profundo sentido de responsabilidad y compromiso social.
              </p>
            </div>
          </div>

          {/* CARRERAS CARDS */}
          <CarrerasCards />

        </div>
      </div>

      <div className="hidden lg:block w-[10%] xl:w-[20%]">
        <InfoUnefaRightMenu />
      </div>
    </div>
  );
};

export default CarrerasPage;
