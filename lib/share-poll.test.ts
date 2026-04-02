import { describe, expect, it, vi } from "vitest";

import { sharePoll } from "@/lib/share-poll";

describe("sharePoll", () => {
  it("copies the poll link when native share is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    const result = await sharePoll("Poll title", "http://localhost:3000/poll/poll-1", {
      writeText,
    });

    expect(result).toBe("copied");
    expect(writeText).toHaveBeenCalledWith("http://localhost:3000/poll/poll-1");
  });

  it("uses native share when available", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn().mockResolvedValue(undefined);

    const result = await sharePoll("Poll title", "http://localhost:3000/poll/poll-1", {
      share,
      writeText,
    });

    expect(result).toBe("shared");
    expect(share).toHaveBeenCalledWith({
      title: "Poll title",
      text: "Vote on this poll",
      url: "http://localhost:3000/poll/poll-1",
    });
    expect(writeText).not.toHaveBeenCalled();
  });
});
