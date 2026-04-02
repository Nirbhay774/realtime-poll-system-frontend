"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { useAuth } from "@/components/providers/auth-provider";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

type AuthMode = "login" | "register";

type AuthFormState = {
  name: string;
  email: string;
  password: string;
};

const initialForm: AuthFormState = {
  name: "",
  email: "",
  password: "",
};

export function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();

  const handleChange = (field: keyof AuthFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await register(form);
        toast.success("Account created successfully");
      } else {
        await login({
          email: form.email,
          password: form.password,
        });
        toast.success("Logged in successfully");
      }

      router.push(nextPath);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to continue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <PageHeader
            badge="Account"
            title="Login once and create polls faster"
            description="Voting stays open for every visitor, but poll creation now belongs to signed-in users so your dashboard feels cleaner and more personal."
          />

          <Card className="space-y-5 bg-slate-950 text-slate-50">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">How it works</p>
              <h2 className="text-2xl font-semibold">Public voting, private creation</h2>
            </div>
            <div className="grid gap-3 text-sm text-slate-200">
              <p>Anyone with the shared poll link can open the poll and vote without making an account.</p>
              <p>When you want to launch your own poll, login or register here and we’ll take you straight back.</p>
            </div>
          </Card>
        </div>

        <Card className="border-slate-200/70 bg-white/90">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
              {(["login", "register"] as AuthMode[]).map((authMode) => (
                <button
                  key={authMode}
                  type="button"
                  onClick={() => setMode(authMode)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    mode === authMode ? "bg-slate-950 text-white" : "text-slate-600"
                  }`}
                >
                  {authMode === "login" ? "Login" : "Register"}
                </button>
              ))}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "register" ? (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Full name
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    placeholder="Ritesh Kumar"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                    required
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(event) => handleChange("password", event.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Please wait..." : mode === "login" ? "Login to continue" : "Create account"}
              </button>
            </form>

            <p className="text-sm text-slate-500">
              Want to go back first?{" "}
              <Link href={nextPath} className="font-medium text-slate-900 underline decoration-cyan-300 underline-offset-4">
                Return to your previous page
              </Link>
            </p>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
