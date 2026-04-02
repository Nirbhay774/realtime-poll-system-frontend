import React from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PollVotePanel } from "@/components/polls/poll-vote-panel";
import type { Poll } from "@/lib/types";

vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const poll: Poll = {
  id: "poll-1",
  question: "What should we build?",
  description: "Choose one option",
  createdAt: "2026-04-02T00:00:00.000Z",
  updatedAt: "2026-04-02T00:00:00.000Z",
  totalVotes: 4,
  hasVoted: false,
  options: [
    { id: "option-1", label: "Share links", votes: 2 },
    { id: "option-2", label: "Realtime updates", votes: 2 },
  ],
};

describe("PollVotePanel", () => {
  it("disables voting when the browser already voted", () => {
    render(
      React.createElement(PollVotePanel, {
        poll: { ...poll, hasVoted: true },
        isLoading: false,
        onSubmitVote: vi.fn().mockResolvedValue(undefined),
      }),
    );

    expect(screen.getByRole("button", { name: "Vote submitted from this browser" })).toBeDisabled();
  });
});
