"use client";

import { votePoll } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { useState, useTransition } from "react";

type PollProps = {
  poll: {
    id: number;
    postId: number;
    title: string | null;
    options: {
      id: number;
      pollId: number;
      option: string;
      _count: { votes: number };
    }[];
    votes: {
      userId: string;
      pollOptionId: number;
    }[];
  };
};

const PollDisplay = ({ poll }: PollProps) => {
  const { userId } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [optimisticVote, setOptimisticVote] = useState<{ pollOptionId: number } | null>(null);

  // Determine if the user has voted
  const userVote = poll.votes.find((vote) => vote.userId === userId);
  const hasVoted = !!userVote || !!optimisticVote;
  const votedOptionId = optimisticVote ? optimisticVote.pollOptionId : userVote?.pollOptionId;

  // Calculate total votes
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt._count.votes, 0) + (optimisticVote && !userVote ? 1 : 0);

  const handleVote = (pollOptionId: number) => {
    if (!userId) return;

    setOptimisticVote({ pollOptionId });

    startTransition(async () => {
      try {
        await votePoll(poll.id, pollOptionId);
      } catch (error) {
        console.error("Failed to vote:", error);
        setOptimisticVote(null); // Revert on failure
      }
    });
  };

  return (
    <div className="flex flex-col gap-3 mt-2">
      {poll.title && <h3 className="font-semibold text-gray-700">{poll.title}</h3>}
      {poll.options.map((opt) => {
        // Adjust votes count for optimistic update
        let optVotes = opt._count.votes;
        if (optimisticVote?.pollOptionId === opt.id && userVote?.pollOptionId !== opt.id) {
          optVotes += 1;
        }
        if (optimisticVote?.pollOptionId !== opt.id && userVote?.pollOptionId === opt.id) {
          optVotes -= 1;
        }

        const percentage = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
        const isVotedOption = votedOptionId === opt.id;

        if (hasVoted) {
          return (
            <div key={opt.id} className="relative w-full h-10 bg-slate-100 rounded-md overflow-hidden flex items-center px-4 cursor-default">
              <div
                className={`absolute top-0 left-0 h-full ${isVotedOption ? 'bg-blue-200' : 'bg-slate-200'} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              ></div>
              <div className="relative z-10 flex justify-between w-full text-sm font-medium">
                <span className="truncate mr-2">{opt.option}</span>
                <span className="flex-shrink-0">{percentage}%</span>
              </div>
            </div>
          );
        }

        return (
          <button
            key={opt.id}
            disabled={isPending}
            onClick={() => handleVote(opt.id)}
            className="w-full h-10 border border-blue-500 text-blue-500 rounded-md flex items-center justify-center font-medium hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {opt.option}
          </button>
        );
      })}
      {hasVoted && (
        <span className="text-xs text-gray-500">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
      )}
    </div>
  );
};

export default PollDisplay;
