import { create } from "zustand";
import { UIMessage } from "./chat.types";
import { MessagePayload } from "@/hooks/useWebsocket";

type MessageCache = { [userId: string]: { [contentId: string]: UIMessage } };

interface ChatStore {
  cache: MessageCache;
  get: () => UIMessage[];
  add: (m: MessagePayload) => void;
  addBulk: (m: MessagePayload[]) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  cache: {},

  /** Get all the messages in the message cache */
  get: () => getMessages(get().cache),

  /** Add a message to the message cache */
  add: (m) => set((s) => ({ cache: insertMessages([m], s.cache) })),

  /** bulk add messages */
  addBulk: (m) => set((s) => ({ cache: insertMessages(m, s.cache) })),
}));

export const getMessages = (cache: MessageCache) =>
  Object.values(cache).flatMap((m) => Object.values(m));

const insertMessages = (
  messages: MessagePayload[],
  cache: MessageCache
): MessageCache => {
  const newCache = { ...cache };

  messages.forEach((message) => {
    const { user, content, sentAt } = message;
    let text = "";

    if ("fragment" in content) {
      const existing = newCache[user.id]?.[content.id]?.text;
      text = (existing ?? "") + content.fragment;
    } else if ("text" in content) {
      text = content.text;
    }

    newCache[user.id] = {
      ...(newCache[user.id] ?? {}),
      [content.id]: {
        id: user.id,
        role: user.role,
        text,
        sentAt,
        name: user.name,
      },
    };
  });

  return newCache;
};
