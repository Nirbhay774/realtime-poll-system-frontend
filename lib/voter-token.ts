const VOTER_TOKEN_STORAGE_KEY = "poll-app-voter-token";
const VOTED_POLLS_STORAGE_KEY = "poll-app-voted-polls";

function canUseLocalStorage() {
  return typeof window !== "undefined";
}

export function getBrowserVoterToken() {
  if (!canUseLocalStorage()) {
    return "";
  }

  const existingToken = window.localStorage.getItem(VOTER_TOKEN_STORAGE_KEY);

  if (existingToken) {
    return existingToken;
  }

  const token = crypto.randomUUID();
  window.localStorage.setItem(VOTER_TOKEN_STORAGE_KEY, token);
  return token;
}

function readVotedPolls() {
  if (!canUseLocalStorage()) {
    return [] as string[];
  }

  const rawValue = window.localStorage.getItem(VOTED_POLLS_STORAGE_KEY);

  if (!rawValue) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(rawValue) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function hasBrowserVotedForPoll(pollId: string) {
  return readVotedPolls().includes(pollId);
}

export function markBrowserVotedForPoll(pollId: string) {
  if (!canUseLocalStorage()) {
    return;
  }

  const votedPolls = new Set(readVotedPolls());
  votedPolls.add(pollId);
  window.localStorage.setItem(VOTED_POLLS_STORAGE_KEY, JSON.stringify(Array.from(votedPolls)));
}
