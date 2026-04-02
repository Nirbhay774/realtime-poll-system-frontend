import type { Poll } from "@/lib/types";

type PollResultsProps = {
  poll: Poll;
};

export function PollResults({ poll }: PollResultsProps) {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="space-y-4">
      {poll.options.map((option) => {
        const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);

        return (
          <div key={option.id} className="space-y-2">
            <div className="flex items-center justify-between gap-4 text-sm text-slate-700">
              <span>{option.label}</span>
              <span className="font-medium text-slate-900">
                {option.votes} votes | {percentage}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-slate-900 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
