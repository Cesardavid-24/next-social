import Link from "next/link";
import MobileMenu from "./MobileMenu";
import Image from "next/image";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import NavbarNotifications from "./NavbarNotifications";
import NavbarStories from "./NavbarStories";
import SearchBar from "./SearchBar";
import NavbarMessages from "./NavbarMessages";
import { getUnreadMessages } from "@/lib/actions";

const Navbar = async () => {
  const clerkUser = await currentUser();
  const userId = clerkUser?.id;

  let requests: any[] = [];
  let stories: any[] = [];
  let unreadMessages: any[] = [];
  if (userId) {
    // Sync Clerk avatar with DB avatar
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    if (dbUser && clerkUser?.imageUrl && dbUser.avatar !== clerkUser.imageUrl) {
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: clerkUser.imageUrl },
      });
    }

    unreadMessages = await getUnreadMessages();
    requests = await prisma.followRequest.findMany({
      where: {
        receiverId: userId,
      },
      include: {
        sender: true,
      },
    });

    const following = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((f) => f.followingId);

    stories = await prisma.story.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
        userId: {
          in: [userId, ...followingIds],
        },
      },
      include: {
        user: true,
      },
    });
  }

  return (
    <div className="h-24 flex items-center justify-between">
      {/* LEFT */}
      <div className="md:hidden lg:block w-[20%]">
        <Link href="/" className="font-bold text-xl text-blue-600 flex items-center gap-2">
          <Image src="/logo-unefa.png" alt="Logo" width={32} height={32} className="object-contain" />
          <span>SomosUnefaEE</span>
        </Link>
      </div>
      {/* CENTER */}
      {userId && (
        <div className="hidden md:flex w-[50%] text-sm items-center justify-between">
          {/* LINKS */}
          <div className="flex gap-4 lg:gap-6 text-gray-600">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/home.png"
                alt="Inicio"
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span>Inicio</span>
            </Link>
            <Link href="/friends" className="flex items-center gap-2">
              <Image
                src="/friends.png"
                alt="Amigos"
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span>Amigos</span>
            </Link>
            <NavbarStories stories={stories} userId={userId} />
          </div>
          <SearchBar />
        </div>
      )}
      {/* RIGHT */}
      <div className="w-[30%] flex items-center gap-4 xl:gap-8 justify-end">
        {userId ? (
          <>
            <ClerkLoading>
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
            </ClerkLoading>
            <ClerkLoaded>
              <SignedIn>
                <Link href="/people" className="cursor-pointer flex flex-col items-center gap-1">
                  <Image src="/people.png" alt="People" width={20} height={20} className="w-5 h-5" />
                  <span className="text-[10px] text-gray-500">Personas</span>
                </Link>
                <NavbarMessages unreadMessages={unreadMessages} />
                <NavbarNotifications requests={requests} />
                <UserButton />
              </SignedIn>
            </ClerkLoaded>
            <MobileMenu />
          </>
        ) : (
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/sign-in" className="hidden md:block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/sign-up" className="text-sm font-medium bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
