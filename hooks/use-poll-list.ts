"use client";

import { useEffect, useState } from "react";

import type { Poll } from "@/lib/types";
import { createPollSocket } from "@/lib/socket";
import { listPolls } from "@/services/polls";

export function usePollList() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPolls = async () => {
      try {
        const allPolls = await listPolls();
        if (isMounted) {
          setPolls(allPolls);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPolls();

    const socket = createPollSocket({
      channel: "poll-list",
      onPollListUpdated: (update) => {
        setPolls((currentPolls) =>
          currentPolls.map((poll) =>
            poll.id === update.id ? { ...poll, totalVotes: update.totalVotes, updatedAt: update.updatedAt } : poll,
          ),
        );
      },
    });
    socket.connect();

    return () => {
      isMounted = false;
      socket.disconnect();
    };
  }, []);

  return {
    polls,
    isLoading,
  };
}
