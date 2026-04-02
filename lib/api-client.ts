const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = RequestInit & {
  path: string;
};

async function request<T>({ path, ...init }: RequestOptions): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;

    try {
      const payload = (await response.json()) as { message?: string };

      if (payload.message) {
        message = payload.message;
      }
    } catch {
      // Ignore non-JSON responses and keep the fallback message.
    }

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, init?: Omit<RequestInit, "method">) =>
    request<T>({ path, method: "GET", ...init }),
  post: <T>(path: string, body?: unknown, init?: Omit<RequestInit, "method" | "body">) =>
    request<T>({
      path,
      method: "POST",
      ...init,
      body: body ? JSON.stringify(body) : undefined,
    }),
};

export function hasApiConfig() {
  return Boolean(API_BASE_URL);
}
