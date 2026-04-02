"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const { session, isLoading, logout } = useAuth();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.14),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#ecfeff_45%,_#f8fafc_100%)] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/75 px-5 py-4 shadow-[0_25px_80px_-40px_rgba(8,47,73,0.45)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-1">
            <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
              Poll Studio
            </Link>
            <p className="text-sm text-slate-600">Create polished polls, share them fast, and watch results update live.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/features"
              className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
            >
              Features
            </Link>

            <Link
              href={session ? "/create" : "/auth?next=/create"}
              className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-600"
            >
              Create poll
            </Link>

            {isLoading ? (
              <span className="text-sm text-slate-500">Loading account...</span>
            ) : session ? (
              <>
                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
                  {session.user.name}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth?next=/create"
                className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Login / Register
              </Link>
            )}
          </div>
        </header>

        <div>{children}</div>
      </div>
    </main>
  );
}
