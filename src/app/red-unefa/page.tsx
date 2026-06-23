import AddPost from "@/components/AddPost";
import Feed from "@/components/feed/Feed";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import GroupRightMenu from "@/components/rightMenu/GroupRightMenu";
import Image from "next/image";
import GroupJoinButton from "@/components/GroupJoinButton";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";

const RedUnefaPage = async () => {
  const { userId } = auth();
  const groupId = "red-unefa";

  let isMember = false;
  if (userId) {
    const membership = await prisma.groupMember.findFirst({
      where: {
        userId,
        groupId,
      },
    });
    isMember = !!membership;
  }

  const memberCount = await prisma.groupMember.count({
    where: {
      groupId,
    },
  });

  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          {/* GROUP HEADER */}
          <div className="bg-white rounded-lg shadow-md flex flex-col items-center">
            <div className="w-full h-64 relative">
              <Image
                src="/unefa_cover.png"
                alt="Red Unefa Cover"
                fill
                className="object-cover rounded-t-lg"
              />
              <Image
                src="/logo-unefa.png"
                alt="Logo Unefa"
                width={128}
                height={128}
                className="w-32 h-32 rounded-full object-contain bg-white border-4 border-white absolute left-0 right-0 m-auto -bottom-16 shadow-md"
              />
            </div>
            <div className="p-6 flex flex-col items-center gap-2 mt-12">
              <h1 className="text-3xl font-bold">Red Unefa</h1>
              <p className="text-gray-500 text-center max-w-xl">
                La red comunitaria oficial de la universidad. Comparte fotos, videos, encuestas y mantente conectado con todos.
              </p>
              {!isMember && (
                <div className="flex gap-4 mt-2">
                  {userId ? (
                    <GroupJoinButton groupId={groupId} isMember={isMember} />
                  ) : (
                    <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-md hover:bg-gray-300">
                      Inicia sesión para Unirte
                    </button>
                  )}
                  <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-md hover:bg-gray-300">
                    Invitar
                  </button>
                </div>
              )}
            </div>
          </div>

          {isMember ? (
            <>
              <AddPost groupId="red-unefa" />
              <Feed groupId="red-unefa" />
            </>
          ) : (
            <div className="p-12 bg-white rounded-lg shadow-md flex flex-col items-center justify-center text-gray-500">
              <Image src="/activity.png" alt="" width={48} height={48} className="mb-4 opacity-50" />
              <h2 className="text-xl font-bold mb-2">Grupo Privado</h2>
              <p>Únete al grupo para ver y publicar contenido.</p>
            </div>
          )}
        </div>
      </div>
      <div className="hidden lg:block w-[30%]">
        <GroupRightMenu memberCount={memberCount} />
      </div>
    </div>
  );
};

export default RedUnefaPage;
