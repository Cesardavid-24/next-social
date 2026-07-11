import LeftMenu from "@/components/leftMenu/LeftMenu";
import InfoUnefaRightMenu from "@/components/rightMenu/InfoUnefaRightMenu";
import EventFeed from "@/components/events/EventFeed";
import prisma from "@/lib/client";
import Image from "next/image";

const InfoUnefaPage = async () => {
  // Fetch events from the database
  const events = await prisma.event.findMany({
    orderBy: {
      date: "asc", // nearest events first
    },
    // We only want future events or all events depending on requirements
    // For now, let's fetch all events and rely on the UI or a where clause later
    where: {
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)) // from today onwards
      }
    }
  });

  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>

      <div className="w-full lg:w-[70%] xl:w-[60%] mx-auto">
        <div className="flex flex-col gap-6">
          {/* HEADER / BANNER */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-lg shadow-md p-8 text-white flex flex-col sm:flex-row items-center gap-6">
            <Image 
              src="/logo-unefa.png" 
              alt="Logo Unefa" 
              width={100} 
              height={100} 
              className="bg-white rounded-full p-2 object-contain w-24 h-24" 
            />
            <div className="flex flex-col justify-center text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-2">Info Unefa</h1>
              <p className="text-blue-100 max-w-2xl">
                Descubre los próximos eventos académicos, culturales, deportivos y de defensa integral. Planifica tu semana y no te pierdas ninguna actividad importante en nuestra comunidad universitaria.
              </p>
            </div>
          </div>

          {/* INTERACTIVE EVENT FEED (Tabs + List/Calendar) */}
          <EventFeed events={events} />
        </div>
      </div>

      <div className="hidden lg:block w-[10%] xl:w-[20%]">
        <InfoUnefaRightMenu />
      </div>
    </div>
  );
};

export default InfoUnefaPage;
