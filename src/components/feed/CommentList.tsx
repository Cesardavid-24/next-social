"use client";

import { addComment } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { Comment, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useOptimistic, useState } from "react";
import CommentInteraction from "./CommentInteraction";

type CommentWithUserAndLikes = Comment & { 
  user: User;
  likes?: { userId: string }[];
  parentId?: number | null;
};

const CommentNode = ({
  comment,
  repliesMap,
  postId,
  onAddReply,
}: {
  comment: CommentWithUserAndLikes;
  repliesMap: Map<number, CommentWithUserAndLikes[]>;
  postId: number;
  onAddReply: (parentId: number, desc: string) => Promise<void>;
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyDesc, setReplyDesc] = useState("");
  const replies = repliesMap.get(comment.id) || [];
  const { user } = useUser();

  const handleReplySubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!replyDesc.trim()) return;
    await onAddReply(comment.id, replyDesc);
    setReplyDesc("");
    setIsReplying(false);
  };

  return (
    <div className="flex gap-4 justify-between mt-6">
      <Link href={`/profile/${comment.user.username}`}>
        <Image
          src={comment.user.avatar || "/noAvatar.png"}
          alt=""
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
      </Link>
      <div className="flex flex-col gap-2 flex-1">
        <Link
          href={`/profile/${comment.user.username}`}
          className="font-medium hover:underline"
        >
          {comment.user.name && comment.user.surname
            ? comment.user.name + " " + comment.user.surname
            : comment.user.username}
        </Link>
        <p>{comment.desc}</p>
        
        <CommentInteraction
          commentId={comment.id}
          likes={comment.likes?.map((l) => l.userId) || []}
          onReplyClick={() => setIsReplying(!isReplying)}
        />

        {isReplying && user && (
          <form
            className="flex items-center gap-2 mt-2 bg-slate-100 rounded-xl px-4 py-2"
            onSubmit={handleReplySubmit}
          >
            <input
              type="text"
              placeholder="Escribe una respuesta..."
              className="bg-transparent outline-none flex-1 text-sm"
              value={replyDesc}
              onChange={(e) => setReplyDesc(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-600 transition-colors"
            >
              Responder
            </button>
          </form>
        )}

        {replies.length > 0 && (
          <div className="ml-2 border-l-2 border-slate-100 pl-4 mt-2 flex flex-col gap-2">
            {replies.map((reply) => (
              <CommentNode
                key={reply.id}
                comment={reply}
                repliesMap={repliesMap}
                postId={postId}
                onAddReply={onAddReply}
              />
            ))}
          </div>
        )}
      </div>
      <Image
        src="/more.png"
        alt=""
        width={16}
        height={16}
        className="cursor-pointer w-4 h-4 self-start"
      />
    </div>
  );
};

const CommentList = ({
  comments,
  postId,
}: {
  comments: CommentWithUserAndLikes[];
  postId: number;
}) => {
  const { user } = useUser();
  const [commentState, setCommentState] = useState(comments);
  const [desc, setDesc] = useState("");

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state, value: CommentWithUserAndLikes) => [value, ...state]
  );

  const add = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user || !desc.trim()) return;

    const tempDesc = desc;
    setDesc("");

    addOptimisticComment({
      id: Math.random(),
      desc: tempDesc,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      userId: user.id,
      postId: postId,
      parentId: null,
      likes: [],
      user: {
        id: user.id,
        username: "Enviando, por favor espera...",
        avatar: user.imageUrl || "/noAvatar.png",
        cover: "",
        description: "",
        name: "",
        surname: "",
        city: "",
        work: "",
        school: "",
        website: "",
        createdAt: new Date(Date.now()),
      },
    });

    try {
      const createdComment = await addComment(postId, tempDesc);
      setCommentState((prev) => [createdComment as any, ...prev]);
    } catch (err) {}
  };

  const handleAddReply = async (parentId: number, replyDesc: string) => {
    if (!user || !replyDesc.trim()) return;

    addOptimisticComment({
      id: Math.random(),
      desc: replyDesc,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      userId: user.id,
      postId: postId,
      parentId: parentId,
      likes: [],
      user: {
        id: user.id,
        username: "Enviando, por favor espera...",
        avatar: user.imageUrl || "/noAvatar.png",
        cover: "",
        description: "",
        name: "",
        surname: "",
        city: "",
        work: "",
        school: "",
        website: "",
        createdAt: new Date(Date.now()),
      },
    });

    try {
      const createdComment = await addComment(postId, replyDesc, parentId);
      setCommentState((prev) => [createdComment as any, ...prev]);
    } catch (err) {}
  };

  // Build tree
  const rootComments: CommentWithUserAndLikes[] = [];
  const repliesMap = new Map<number, CommentWithUserAndLikes[]>();

  // Ensure stable ordering (oldest first for replies usually, but newest first for top level if we want)
  // The backend currently sorts descending by createdAt, so newest is first.
  optimisticComments.forEach((c) => {
    if (c.parentId) {
      if (!repliesMap.has(c.parentId)) {
        repliesMap.set(c.parentId, []);
      }
      repliesMap.get(c.parentId)!.push(c);
    } else {
      rootComments.push(c);
    }
  });

  return (
    <>
      {user && (
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={user.imageUrl || "/noAvatar.png"}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
          <form
            onSubmit={add}
            className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-4 py-2 w-full"
          >
            <input
              type="text"
              placeholder="escribe un comentario..."
              className="bg-transparent outline-none flex-1"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1.5 rounded-lg ml-2 hover:bg-blue-600 transition-colors shadow-sm"
            >
              Comentar
            </button>
          </form>
        </div>
      )}
      <div className="">
        {rootComments.map((comment) => (
          <CommentNode
            key={comment.id}
            comment={comment}
            repliesMap={repliesMap}
            postId={postId}
            onAddReply={handleAddReply}
          />
        ))}
      </div>
    </>
  );
};

export default CommentList;
