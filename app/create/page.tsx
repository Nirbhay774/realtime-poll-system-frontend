"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

import { useAuth } from "@/components/providers/auth-provider";
import { AppShell } from "@/components/layout/app-shell";
import { PollOptionInputs } from "@/components/polls/poll-option-inputs";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useCreatePollForm } from "@/hooks/use-create-poll-form";
import { createPoll } from "@/services/polls";

export default function CreatePollPage() {
  const router = useRouter();
  const { session, isLoading } = useAuth();
  const { form, updateField, updateOption, addOption, removeOption, isSubmitting, setIsSubmitting } =
    useCreatePollForm();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/auth?next=/create");
    }
  }, [isLoading, router, session]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const poll = await createPoll(form);
      toast.success("Poll created successfully");
      router.push(`/poll/${poll.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create poll");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <section className="space-y-8">
        <PageHeader
          badge="Create"
          title="Create a poll only after login"
          description="Your account unlocks poll creation, while the final shared link still stays open for every voter."
        />

        {!session ? (
          <Card className="max-w-2xl space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Login required</h2>
            <p className="text-sm leading-6 text-slate-600">
              We only allow signed-in users to create polls. You can still open shared polls and vote without an account.
            </p>
            <Link
              href="/auth?next=/create"
              className="inline-flex w-fit items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-600"
            >
              Continue to login
            </Link>
          </Card>
        ) : null}

        <Card className="max-w-3xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="question" className="text-sm font-medium text-slate-700">
                Poll question
              </label>
              <input
                id="question"
                value={form.question}
                onChange={(event) => updateField("question", event.target.value)}
                placeholder="What should we build next?"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Add context for voters"
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <PollOptionInputs
              options={form.options}
              onAddOption={addOption}
              onOptionChange={updateOption}
              onRemoveOption={removeOption}
            />

            <button
              type="submit"
              disabled={isSubmitting || !session}
              className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Creating..." : "Create poll"}
            </button>
          </form>
        </Card>
      </section>
    </AppShell>
  );
}
