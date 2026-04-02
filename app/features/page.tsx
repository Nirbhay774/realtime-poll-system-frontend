import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default function FeaturesPage() {
  const features = [
    {
      title: "User Authentication",
      description: "Secure login and registration system. Creators can manage their polls while visitors can vote anonymously.",
      icon: "🔐",
    },
    {
      title: "Real-time Results",
      description: "Powered by WebSockets. Watch the vote counters and results bars update instantly as people cast their votes.",
      icon: "⚡",
    },
    {
      title: "Poll Expiration",
      description: "Complete control for creators. Expire your polls manually to end voting while keeping the data visible.",
      icon: "⌛",
    },
    {
      title: "Fast Creation",
      description: "A streamlined, focus-optimized form for building polls with multiple options in seconds.",
      icon: "📝",
    },
    {
      title: "One-Click Sharing",
      description: "Native sharing implementation to get your poll link to your audience instantly.",
      icon: "🔗",
    },
    {
      title: "Scalable Tech Stack",
      description: "Built with Next.js 14, TypeScript, and a clean service-oriented architecture for maximum reliability.",
      icon: "🏗️",
    },
  ];

  return (
    <AppShell>
      <section className="space-y-10">
        <PageHeader
          badge="Features"
          title="Designed for speed, built for reliability"
          description="A deep dive into the core functionalities that power the Poll Studio experience."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col gap-4 p-8 transition-all hover:scale-[1.02] hover:border-cyan-300 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-2xl">
                {feature.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-6 text-slate-600">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="flex flex-col items-center gap-6 bg-slate-950 py-12 text-center text-slate-50">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight">Ready to start?</h2>
            <p className="mx-auto max-w-lg text-slate-300">
              Experience all these features for yourself. Create your first poll and start collecting real-time feedback today.
            </p>
          </div>
          <a
            href="/create"
            className="inline-flex rounded-full bg-cyan-400 px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Create your first poll
          </a>
        </Card>
      </section>
    </AppShell>
  );
}
