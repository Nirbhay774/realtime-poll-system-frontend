"use client";

import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { usePollList } from "@/hooks/use-poll-list";

export default function Home() {
  const { session, isLoading: isAuthLoading } = useAuth();
  const { polls, isLoading: isPollsLoading } = usePollList();

  return (
    <AppShell>
      <section className="space-y-10">
        <PageHeader
          badge="Polls"
          title="Launch beautiful polls without slowing down your voters"
          description="Signed-in creators can publish polls in seconds, while visitors can open any shared link and vote right away without creating an account."
        />

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="space-y-6 overflow-hidden bg-slate-950 text-slate-50">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">Quick flow</p>
              <h2 className="text-3xl font-semibold tracking-tight">Create, share, and watch results move live.</h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-200">
                Keep poll creation protected for your logged-in users, then let every viewer vote from the shared page with zero login friction.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={session ? "/create" : "/auth?next=/create"}
                className="inline-flex w-fit items-center rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                {session ? "Create poll now" : "Login to create poll"}
              </Link>
              {!session && !isAuthLoading ? (
                <Link
                  href="/auth?next=/create"
                  className="inline-flex w-fit items-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Register account
                </Link>
              ) : null}
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">What changed</h2>
            <div className="space-y-3 text-sm leading-6 text-slate-600">
              <p>Poll creators now login once, so create actions stay tied to a real account.</p>
              <p>Poll viewers still vote without login, which keeps the shared-link experience simple.</p>
              <p>The create action is available across the app, including directly from a shared poll page.</p>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-slate-900">Recent polls</h2>
            <p className="text-sm text-slate-600">Open any poll, share it again, or track voting activity in real time.</p>
          </div>

          {isPollsLoading ? (
            <Card>Loading polls...</Card>
          ) : polls.length === 0 ? (
            <Card>No polls yet. Create your first poll to see it listed here.</Card>
          ) : (
            <div className="grid gap-4">
              {polls.map((poll) => (
                <Card
                  key={poll.id}
                  className="flex flex-col gap-4 border-slate-200/80 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900">{poll.question}</h3>
                    <p className="text-sm leading-6 text-slate-600">{poll.description || "No description added."}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      By {poll.createdByName} | {poll.options.length} options | {poll.totalVotes} votes |{" "}
                      {new Date(poll.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <Link
                    href={`/poll/${poll.id}`}
                    className="inline-flex w-fit items-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                  >
                    View poll
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
