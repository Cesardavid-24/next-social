import LeftMenu from "@/components/leftMenu/LeftMenu";
import InfoUnefaRightMenu from "@/components/rightMenu/InfoUnefaRightMenu";
import DocentesCards from "@/components/info-unefa/DocentesCards";
import prisma from "@/lib/client";

const DocentesPage = async () => {
  let settings: any[] = [];
  try {
    settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: ["docente1Img", "docente2Img"]
        }
      }
    });
  } catch (err) {
    console.log("Error fetching settings, database might need to be generated", err);
  }

  const docente1Img = settings.find(s => s.key === "docente1Img")?.value || "/noAvatar.png";
  const docente2Img = settings.find(s => s.key === "docente2Img")?.value || "/noAvatar.png";

  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>

      <div className="w-full lg:w-[70%] xl:w-[60%] mx-auto">
        <div className="flex flex-col gap-6">
          {/* HEADER / BANNER */}
          <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-lg shadow-md p-8 text-white flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col justify-center text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-2">Cuerpo Docente</h1>
              <p className="text-green-100 max-w-2xl">
                Conoce a nuestros distinguidos profesores, encargados de guiar y formar a la futura generación de profesionales unefistas.
              </p>
            </div>
          </div>

          {/* DOCENTES CARDS */}
          <DocentesCards initialDocente1Img={docente1Img} initialDocente2Img={docente2Img} />

        </div>
      </div>

      <div className="hidden lg:block w-[10%] xl:w-[20%]">
        <InfoUnefaRightMenu />
      </div>
    </div>
  );
};

export default DocentesPage;
