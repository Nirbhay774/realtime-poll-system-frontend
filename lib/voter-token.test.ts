import { beforeEach, describe, expect, it } from "vitest";

import { getBrowserVoterToken, hasBrowserVotedForPoll, markBrowserVotedForPoll } from "@/lib/voter-token";

describe("voter token helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("reuses a stable browser token", () => {
    const firstToken = getBrowserVoterToken();
    const secondToken = getBrowserVoterToken();

    expect(firstToken).toBeTruthy();
    expect(secondToken).toBe(firstToken);
  });

  it("tracks polls already voted on in this browser", () => {
    expect(hasBrowserVotedForPoll("poll-1")).toBe(false);

    markBrowserVotedForPoll("poll-1");

    expect(hasBrowserVotedForPoll("poll-1")).toBe(true);
  });
});
