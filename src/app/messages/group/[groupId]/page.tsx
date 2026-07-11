import { getGroupChatDetails } from "@/lib/actions";
import { notFound } from "next/navigation";
import GroupChatBox from "@/components/messages/GroupChatBox";
import { auth } from "@clerk/nextjs/server";

export default async function GroupChatPage({ params }: { params: { groupId: string } }) {
  const { userId: currentUserId } = auth();
  if (!currentUserId) return notFound();

  const groupId = parseInt(params.groupId, 10);
  if (isNaN(groupId)) return notFound();

  const groupChat = await getGroupChatDetails(groupId);

  if (!groupChat) return notFound();

  return <GroupChatBox currentUserId={currentUserId} groupChat={groupChat} />;
}
