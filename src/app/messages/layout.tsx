import { getConversations } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import LeftMenu from "@/components/leftMenu/LeftMenu";

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();

  return (
    <div className="flex gap-6 pt-6 h-[calc(100vh-96px)]">
      {/* LEFT MENU */}
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>

      {/* MESSAGES CONTAINER */}
      <div className="w-full lg:w-[80%] xl:w-[80%] flex bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden h-full">
        {/* SIDEBAR (Conversations) */}
        <div className="w-[30%] border-r border-gray-200 flex flex-col h-full bg-slate-50">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="font-bold text-xl text-gray-700">Mensajes</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((user: any) => (
                <Link
                  href={`/messages/${user.username}`}
                  key={user.id}
                  className="flex items-center gap-3 p-4 hover:bg-slate-100 cursor-pointer transition-colors border-b border-gray-100"
                >
                  <Image
                    src={user.avatar || "/noAvatar.png"}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col hidden sm:flex">
                    <span className="font-semibold text-sm text-gray-800">
                      {user.name && user.surname
                        ? `${user.name} ${user.surname}`
                        : user.username}
                    </span>
                    <span className="text-xs text-gray-500">@{user.username}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No tienes conversaciones aún. Ve a un perfil y envía un mensaje.
              </div>
            )}
          </div>
        </div>

        {/* MAIN CHAT AREA */}
        <div className="w-[70%] h-full flex flex-col bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}
