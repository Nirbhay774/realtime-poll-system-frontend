type SharePollDependencies = {
  share?: (data: { title: string; text: string; url: string }) => Promise<void>;
  writeText?: (value: string) => Promise<void>;
};

export async function sharePoll(
  title: string,
  url: string,
  dependencies: SharePollDependencies = {},
) {
  const share = dependencies.share ?? navigator.share?.bind(navigator);
  const writeText = dependencies.writeText ?? navigator.clipboard?.writeText?.bind(navigator.clipboard);

  if (share) {
    await share({
      title,
      text: "Vote on this poll",
      url,
    });

    return "shared" as const;
  }

  if (!writeText) {
    throw new Error("Clipboard is not available");
  }

  await writeText(url);
  return "copied" as const;
}
