import { create } from "zustand";
import { UIMessage } from "./chat.types";
import { MessagePayload } from "@/hooks/useWebsocket";

type MessageCache = { [userId: string]: { [contentId: string]: UIMessage } };

interface ChatStore {
  cache: MessageCache;
  add: (m: MessagePayload) => void;
  get: () => UIMessage[];
}

export const useChatStore = create<ChatStore>((set, get) => ({
  cache: {},

  /** Add a message to the message cache */
  add: (m) => set((s) => ({ cache: insertMessage(m, s.cache) })),
  get: () => getMessages(get().cache),
}));

export const getMessages = (cache: MessageCache) =>
  Object.values(cache).flatMap((m) => Object.values(m));

const insertMessage = (
  message: MessagePayload,
  cache: MessageCache
): MessageCache => {
  const { user, content, sentAt } = message;
  let text = "";

  if ("fragment" in content) {
    const existing = cache[user.id]?.[content.id]?.text;
    text = (existing ?? "") + content.fragment;
  } else if ("text" in content) {
    text = content.text;
  }

  return {
    ...cache,
    [user.id]: {
      ...(cache[user.id] ?? {}),
      [content.id]: {
        id: user.id,
        role: user.role,
        text,
        sentAt,
      },
    },
  };
};
