"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api-client";
import type { Poll } from "@/lib/types";
import { createPollSocket } from "@/lib/socket";
import { hasBrowserVotedForPoll, markBrowserVotedForPoll } from "@/lib/voter-token";
import { getPollById, voteOnPoll } from "@/services/polls";

export function usePoll(id: string) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPoll = async () => {
      try {
        const pollData = await getPollById(id);
        if (isMounted) {
          setPoll({
            ...pollData,
            hasVoted: pollData.hasVoted ?? hasBrowserVotedForPoll(id),
          });
        }
      } catch {
        if (isMounted) {
          setPoll(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPoll();

    const socket = createPollSocket({
      channel: `poll:${id}`,
      onPollUpdated: (updatedPoll) => {
        setPoll((currentPoll) => ({
          ...updatedPoll,
          hasVoted: currentPoll?.hasVoted ?? hasBrowserVotedForPoll(id),
        }));
      },
    });
    socket.connect();

    return () => {
      isMounted = false;
      socket.disconnect();
    };
  }, [id]);

  const submitVote = async (optionId: string) => {
    if (poll?.hasVoted || hasBrowserVotedForPoll(id)) {
      throw new Error("You already voted on this poll from this browser.");
    }

    try {
      const updatedPoll = await voteOnPoll(id, optionId);
      markBrowserVotedForPoll(id);
      setPoll({ ...updatedPoll, hasVoted: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        markBrowserVotedForPoll(id);
        setPoll((currentPoll) => (currentPoll ? { ...currentPoll, hasVoted: true } : currentPoll));
      }

      throw error;
    }
  };

  return {
    poll,
    isLoading,
    submitVote,
  };
}
