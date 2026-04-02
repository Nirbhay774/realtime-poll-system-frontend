"use client";

import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { AppShell } from "@/components/layout/app-shell";
import { PollVotePanel } from "@/components/polls/poll-vote-panel";
import { PageHeader } from "@/components/ui/page-header";
import { usePoll } from "@/hooks/use-poll";

type PollPageProps = {
  params: {
    id: string;
  };
};

export default function PollPage({ params }: PollPageProps) {
  const { session } = useAuth();
  const { poll, isLoading, submitVote } = usePoll(params.id);

  return (
    <AppShell>
      <section className="space-y-8">
        <PageHeader
          badge="Vote"
          title="Vote instantly from a shared link"
          description="Anyone can vote here without login. If you want to publish your own poll, use the create action below and we’ll guide you through login first."
        />

        <div className="flex flex-wrap gap-3">
          <Link
            href={session ? "/create" : "/auth?next=/create"}
            className="inline-flex items-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-600"
          >
            Create your own poll
          </Link>
        </div>

        <PollVotePanel poll={poll} isLoading={isLoading} onSubmitVote={submitVote} />
      </section>
    </AppShell>
  );
}
