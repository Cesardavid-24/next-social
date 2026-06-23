import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";
import FriendRequestList from "@/components/rightMenu/FriendRequestList";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const FriendsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 1. Fetch friend requests (follow requests received)
  const requests = await prisma.followRequest.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      sender: true,
    },
  });

  // 2. Fetch followers (people following the current user)
  const followers = await prisma.follower.findMany({
    where: {
      followingId: userId,
    },
    include: {
      follower: true,
    },
  });

  // 3. Fetch followings (people the current user is following)
  const followings = await prisma.follower.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: true,
    },
  });

  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>
      <div className="w-full lg:w-[70%] xl:w-[50%] flex flex-col gap-6">
        {/* FRIEND REQUESTS SECTION */}
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
          <h1 className="text-gray-500 font-medium text-lg">Solicitudes de Amistad ({requests.length})</h1>
          {requests.length > 0 ? (
            <FriendRequestList requests={requests} />
          ) : (
            <p className="text-gray-400">No hay solicitudes de amistad pendientes.</p>
          )}
        </div>

        {/* FOLLOWERS SECTION */}
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
          <h1 className="text-gray-500 font-medium text-lg">Seguidores ({followers.length})</h1>
          {followers.length > 0 ? (
            <div className="flex flex-col gap-4">
              {followers.map((f) => (
                <div key={f.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={f.follower.avatar || "/noAvatar.png"}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-semibold">
                      {f.follower.name && f.follower.surname
                        ? f.follower.name + " " + f.follower.surname
                        : f.follower.username}
                    </span>
                  </div>
                  <Link href={`/profile/${f.follower.username}`} className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-600 transition">
                    Ver Perfil
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Aún no tienes seguidores.</p>
          )}
        </div>

        {/* FOLLOWING SECTION */}
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
          <h1 className="text-gray-500 font-medium text-lg">Siguiendo ({followings.length})</h1>
          {followings.length > 0 ? (
            <div className="flex flex-col gap-4">
              {followings.map((f) => (
                <div key={f.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={f.following.avatar || "/noAvatar.png"}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-semibold">
                      {f.following.name && f.following.surname
                        ? f.following.name + " " + f.following.surname
                        : f.following.username}
                    </span>
                  </div>
                  <Link href={`/profile/${f.following.username}`} className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-600 transition">
                    Ver Perfil
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Aún no sigues a nadie.</p>
          )}
        </div>
      </div>
      <div className="hidden lg:block w-[30%]">
        <RightMenu />
      </div>
    </div>
  );
};

export default FriendsPage;
