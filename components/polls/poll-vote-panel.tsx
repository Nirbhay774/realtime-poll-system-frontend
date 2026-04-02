"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { useAuth } from "@/components/providers/auth-provider";
import { sharePoll } from "@/lib/share-poll";
import type { Poll } from "@/lib/types";

import { Card } from "@/components/ui/card";
import { PollResults } from "@/components/polls/poll-results";
import { expirePoll } from "@/services/polls";

type PollVotePanelProps = {
  poll: Poll | null;
  isLoading: boolean;
  onSubmitVote: (optionId: string) => Promise<void>;
};

export function PollVotePanel({ poll, isLoading, onSubmitVote }: PollVotePanelProps) {
  const { session } = useAuth();
  const [selectedOptionId, setSelectedOptionId] = useState<string>("");
  const [isVoting, setIsVoting] = useState(false);
  const [isExpiring, setIsExpiring] = useState(false);

  if (isLoading) {
    return <Card>Loading poll...</Card>;
  }

  if (!poll) {
    return <Card>Poll not found.</Card>;
  }

  const isCreator = session?.user.id === poll.createdBy;
  const isExpired = poll.isExpired;
  const totalVotes = poll.totalVotes;

  const handleVote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isExpired) {
      toast.error("This poll has expired.");
      return;
    }

    if (!selectedOptionId) {
      toast.error("Select an option before submitting");
      return;
    }

    setIsVoting(true);

    try {
      await onSubmitVote(selectedOptionId);
      toast.success("Vote submitted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit vote");
    } finally {
      setIsVoting(false);
    }
  };

  const handleExpire = async () => {
    if (!window.confirm("Are you sure you want to expire this poll? This action cannot be undone.")) {
      return;
    }

    setIsExpiring(true);

    try {
      await expirePoll(poll.id);
      toast.success("Poll expired successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to expire poll");
    } finally {
      setIsExpiring(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-slate-900">{poll.question}</h2>
                  {isExpired && (
                    <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-800">
                      Expired
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Created by {poll.createdByName}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {isCreator && !isExpired && (
                  <button
                    type="button"
                    onClick={handleExpire}
                    disabled={isExpiring}
                    className="inline-flex items-center rounded-full border border-rose-300 px-4 py-2 text-sm font-medium text-rose-700 transition hover:border-rose-400 hover:bg-rose-50 disabled:opacity-50"
                  >
                    {isExpiring ? "Expiring..." : "Expire poll"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    const result = await sharePoll(poll.question, window.location.href);

                    if (result === "copied") {
                      toast.success("Poll link copied");
                    }
                  }}
                  className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                >
                  Share poll
                </button>
                <Link
                  href={session ? "/create" : "/auth?next=/create"}
                  className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-600"
                >
                  Create poll
                </Link>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-600">{poll.description || "No description added for this poll."}</p>
          </div>

          <form className="space-y-4" onSubmit={handleVote}>
            {poll.options.map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                  isExpired
                    ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
                    : "cursor-pointer border-slate-200 bg-white hover:border-cyan-300"
                }`}
              >
                <input
                  type="radio"
                  name="poll-option"
                  value={option.id}
                  checked={selectedOptionId === option.id}
                  onChange={() => setSelectedOptionId(option.id)}
                  disabled={Boolean(poll.hasVoted) || isVoting || isExpired}
                  className="h-4 w-4 border-slate-300 text-slate-900 focus:ring-cyan-400 disabled:opacity-50"
                />
                <span className={`text-sm font-medium ${isExpired ? "text-slate-400" : "text-slate-800"}`}>
                  {option.label}
                </span>
              </label>
            ))}

            <button
              type="submit"
              disabled={isVoting || Boolean(poll.hasVoted) || isExpired}
              className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isVoting
                ? "Submitting..."
                : isExpired
                ? "Poll has expired"
                : poll.hasVoted
                ? "Vote submitted from this browser"
                : "Submit vote"}
            </button>
          </form>
        </div>
      </Card>

      <Card className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Live results</p>
          <h3 className="text-2xl font-semibold text-slate-900">{totalVotes} total votes</h3>
        </div>
        <PollResults poll={poll} />
      </Card>
    </div>
  );
}
