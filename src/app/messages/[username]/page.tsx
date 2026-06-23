import prisma from "@/lib/client";
import { notFound } from "next/navigation";
import ChatBox from "@/components/ChatBox";
import { auth } from "@clerk/nextjs/server";

export default async function ChatPage({ params }: { params: { username: string } }) {
  const { userId: currentUserId } = auth();
  if (!currentUserId) return notFound();

  const otherUser = await prisma.user.findUnique({
    where: { username: params.username },
  });

  if (!otherUser) return notFound();

  return <ChatBox currentUserId={currentUserId} otherUser={otherUser} />;
}
