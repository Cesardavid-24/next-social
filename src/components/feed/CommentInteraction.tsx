"use client";

import { switchCommentLike } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useOptimistic, useState } from "react";

const CommentInteraction = ({
  commentId,
  likes,
  onReplyClick,
}: {
  commentId: number;
  likes: string[];
  onReplyClick: () => void;
}) => {
  const { isLoaded, userId } = useAuth();
  const [likeState, setLikeState] = useState({
    likeCount: likes.length,
    isLiked: userId ? likes.includes(userId) : false,
  });

  const [optimisticLike, switchOptimisticLike] = useOptimistic(
    likeState,
    (state, value) => {
      return {
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked,
      };
    }
  );

  const likeAction = async () => {
    if (!userId) return;
    switchOptimisticLike("");
    try {
      switchCommentLike(commentId);
      setLikeState((state) => ({
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked,
      }));
    } catch (err) {}
  };

  return (
    <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
      <div className="flex items-center gap-4">
        <form action={likeAction}>
          <button className="flex items-center gap-1">
            <Image
              src={optimisticLike.isLiked ? "/liked.png" : "/like.png"}
              alt=""
              width={16}
              height={16}
              className="cursor-pointer w-4 h-4"
            />
          </button>
        </form>
        <span className="text-gray-300">|</span>
        <span className="text-gray-500">{optimisticLike.likeCount} Me gusta</span>
      </div>
      <div className="cursor-pointer hover:underline" onClick={onReplyClick}>
        Responder
      </div>
    </div>
  );
};

export default CommentInteraction;
