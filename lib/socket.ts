import type { Poll, PollListUpdate } from "@/lib/types";

type PollSocketOptions = {
  channel: string;
  onPollUpdated?: (poll: Poll) => void;
  onPollListUpdated?: (update: PollListUpdate) => void;
};

type SocketEvent =
  | {
      type: "poll.updated";
      payload: Poll;
    }
  | {
      type: "poll-list.updated";
      payload: PollListUpdate;
    }
  | {
      type: "error";
      payload: {
        message: string;
      };
    };

type PollSocket = {
  connect: () => void;
  disconnect: () => void;
};

function getSocketBaseUrl() {
  const explicitSocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

  if (explicitSocketUrl) {
    return explicitSocketUrl;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return "";
  }

  return apiBaseUrl.replace(/^http/i, "ws");
}

export function createPollSocket({
  channel,
  onPollUpdated,
  onPollListUpdated,
}: PollSocketOptions): PollSocket {
  const socketBaseUrl = getSocketBaseUrl();
  let socket: WebSocket | null = null;

  return {
    connect() {
      if (typeof window === "undefined" || !socketBaseUrl) {
        return;
      }

      socket = new WebSocket(`${socketBaseUrl}/ws`);

      socket.addEventListener("open", () => {
        socket?.send(
          JSON.stringify({
            type: "subscribe",
            channel,
          }),
        );
      });

      socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data) as SocketEvent;

        if (message.type === "poll.updated") {
          onPollUpdated?.(message.payload);
          return;
        }

        if (message.type === "poll-list.updated") {
          onPollListUpdated?.(message.payload);
        }
      });
    },
    disconnect() {
      socket?.close();
      socket = null;
    },
  };
}
