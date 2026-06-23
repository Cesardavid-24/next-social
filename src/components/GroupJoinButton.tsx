"use client";

import { useOptimistic, useState } from "react";
import { toggleGroupMembership } from "@/lib/actions";

const GroupJoinButton = ({
  groupId,
  isMember,
}: {
  groupId: string;
  isMember: boolean;
}) => {
  const [memberState, setMemberState] = useState(isMember);

  const [optimisticMembership, switchOptimisticMembership] = useOptimistic(
    memberState,
    (state) => !state
  );

  const handleToggle = async () => {
    switchOptimisticMembership("");
    setMemberState((prev) => !prev);
    try {
      await toggleGroupMembership(groupId);
    } catch (err) {
      // Rollback on error
      setMemberState(isMember);
    }
  };

  return (
    <form action={handleToggle}>
      <button 
        className={`${
          optimisticMembership 
            ? "bg-blue-500 text-white" 
            : "bg-gray-200 text-gray-800"
        } font-semibold py-2 px-6 rounded-md hover:opacity-80 transition-opacity`}
      >
        {optimisticMembership ? "Unido" : "Unirse al Grupo"}
      </button>
    </form>
  );
};

export default GroupJoinButton;
