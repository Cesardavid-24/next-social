import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const PeoplePage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch all users except the current user
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id: userId,
      },
    },
  });

  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>
      <div className="w-full lg:w-[70%] xl:w-[50%] flex flex-col gap-6">
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
          <h1 className="text-gray-500 font-medium text-lg">Comunidad de Usuarios</h1>
          {users.length > 0 ? (
            <div className="flex flex-col gap-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={user.avatar || "/noAvatar.png"}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-semibold">
                      {user.name && user.surname
                        ? user.name + " " + user.surname
                        : user.username}
                    </span>
                  </div>
                  <Link href={`/profile/${user.username}`} className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-600 transition">
                    Ver Perfil
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No se encontraron otros usuarios.</p>
          )}
        </div>
      </div>
      <div className="hidden lg:block w-[30%]">
        <RightMenu />
      </div>
    </div>
  );
};

export default PeoplePage;
