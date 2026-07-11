import LeftMenu from "@/components/leftMenu/LeftMenu";
import InfoUnefaRightMenu from "@/components/rightMenu/InfoUnefaRightMenu";
import AuthorityCards from "@/components/info-unefa/AuthorityCards";
import Image from "next/image";
import prisma from "@/lib/client";

const LineaMandoPage = async () => {
  let settings: any[] = [];
  try {
    settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: ["vicerrectorImg", "decanaImg"]
        }
      }
    });
  } catch (err) {
    console.log("Error fetching settings, database might need to be generated", err);
  }

  const vicerrectorImg = settings.find(s => s.key === "vicerrectorImg")?.value || "/noAvatar.png";
  const decanaImg = settings.find(s => s.key === "decanaImg")?.value || "/noAvatar.png";

  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>

      <div className="w-full lg:w-[70%] xl:w-[60%] mx-auto">
        <div className="flex flex-col gap-6">
          {/* HEADER / BANNER */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-lg shadow-md p-8 text-white flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col justify-center text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-2">Línea de Mando</h1>
              <p className="text-blue-100 max-w-2xl">
                Conoce a las autoridades que dirigen nuestra institución, comprometidos con la excelencia educativa y el desarrollo integral de la comunidad unefista.
              </p>
            </div>
          </div>

          {/* AUTORIDADES CARDS */}
          <AuthorityCards initialVicerrectorImg={vicerrectorImg} initialDecanaImg={decanaImg} />

        </div>
      </div>

      <div className="hidden lg:block w-[10%] xl:w-[20%]">
        <InfoUnefaRightMenu />
      </div>
    </div>
  );
};

export default LineaMandoPage;
