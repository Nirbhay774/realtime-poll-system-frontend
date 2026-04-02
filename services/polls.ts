import { apiClient, hasApiConfig } from "@/lib/api-client";
import { readStoredAuthSession } from "@/lib/auth-storage";
import type { CreatePollPayload, Poll } from "@/lib/types";
import { getBrowserVoterToken } from "@/lib/voter-token";

const POLLS_STORAGE_KEY = "poll-app-polls";

function canUseLocalStorage() {
  return typeof window !== "undefined";
}

function readStoredPolls(): Poll[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  const rawPolls = window.localStorage.getItem(POLLS_STORAGE_KEY);
  if (!rawPolls) {
    return [];
  }

  try {
    return JSON.parse(rawPolls) as Poll[];
  } catch {
    return [];
  }
}

function writeStoredPolls(polls: Poll[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(POLLS_STORAGE_KEY, JSON.stringify(polls));
}

function createPollFromPayload(payload: CreatePollPayload): Poll {
  const timestamp = new Date().toISOString();
  const session = readStoredAuthSession();

  if (!session) {
    throw new Error("Please login to create a poll");
  }

  return {
    id: crypto.randomUUID(),
    createdBy: session.user.id,
    createdByName: session.user.name,
    question: payload.question.trim(),
    description: payload.description.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
    totalVotes: 0,
    hasVoted: false,
    isExpired: false,
    options: payload.options
      .map((option) => option.trim())
      .filter(Boolean)
      .map((option, index) => ({
        id: `option-${index + 1}`,
        label: option,
        votes: 0,
      })),
  };
}

export async function createPoll(payload: CreatePollPayload): Promise<Poll> {
  if (payload.options.filter((option) => option.trim()).length < 2) {
    throw new Error("Add at least two options");
  }

  if (hasApiConfig()) {
    const session = readStoredAuthSession();

    if (!session) {
      throw new Error("Please login to create a poll");
    }

    return apiClient.post<Poll>("/polls", payload, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });
  }

  const poll = createPollFromPayload(payload);
  const polls = readStoredPolls();

  writeStoredPolls([poll, ...polls]);

  return Promise.resolve(poll);
}

export async function listPolls(): Promise<Poll[]> {
  if (hasApiConfig()) {
    return apiClient.get<Poll[]>("/polls");
  }

  return Promise.resolve(
    readStoredPolls().sort(
      (firstPoll, secondPoll) =>
        new Date(secondPoll.createdAt).getTime() - new Date(firstPoll.createdAt).getTime(),
    ),
  );
}

export async function getPollById(id: string): Promise<Poll> {
  if (hasApiConfig()) {
    return apiClient.get<Poll>(`/polls/${id}`, {
      headers: {
        "x-voter-token": getBrowserVoterToken(),
      },
    });
  }

  const poll = readStoredPolls().find((storedPoll) => storedPoll.id === id);

  if (!poll) {
    throw new Error("Poll not found");
  }

  return Promise.resolve(poll);
}

export async function voteOnPoll(id: string, optionId: string): Promise<Poll> {
  if (hasApiConfig()) {
    return apiClient.post<Poll>(`/polls/${id}/vote`, {
      optionId,
      voterToken: getBrowserVoterToken(),
    });
  }

  const polls = readStoredPolls();
  const poll = polls.find((storedPoll) => storedPoll.id === id);

  if (!poll) {
    throw new Error("Poll not found");
  }

  const updatedPoll = {
    ...poll,
    updatedAt: new Date().toISOString(),
    totalVotes: poll.totalVotes + 1,
    hasVoted: true,
    options: poll.options.map((option) =>
      option.id === optionId ? { ...option, votes: option.votes + 1 } : option,
    ),
  };

  writeStoredPolls(
    polls.map((storedPoll) => (storedPoll.id === updatedPoll.id ? updatedPoll : storedPoll)),
  );

  return updatedPoll;
}

export async function expirePoll(id: string): Promise<Poll> {
  if (hasApiConfig()) {
    const session = readStoredAuthSession();

    if (!session) {
      throw new Error("Please login to expire this poll");
    }

    return apiClient.post<Poll>(`/polls/${id}/expire`, undefined, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });
  }

  // Local storage fallback
  const polls = readStoredPolls();
  const poll = polls.find((storedPoll) => storedPoll.id === id);

  if (!poll) {
    throw new Error("Poll not found");
  }

  const updatedPoll = {
    ...poll,
    isExpired: true,
  };

  writeStoredPolls(
    polls.map((storedPoll) => (storedPoll.id === updatedPoll.id ? updatedPoll : storedPoll)),
  );

  return updatedPoll;
}
