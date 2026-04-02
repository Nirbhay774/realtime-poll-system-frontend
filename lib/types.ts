export type PollOption = {
  id: string;
  label: string;
  votes: number;
};

export type Poll = {
  id: string;
  createdBy: string;
  createdByName: string;
  question: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  totalVotes: number;
  hasVoted?: boolean;
  isExpired: boolean;
  options: PollOption[];
};

export type CreatePollPayload = {
  question: string;
  description: string;
  options: string[];
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type PollListUpdate = {
  id: string;
  totalVotes: number;
  updatedAt: string;
};
