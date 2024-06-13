import { useCallback, useState } from "react";

import useWebsocket, { MessagePayload } from "@/hooks/useWebsocket";
import Threads from "@/components/Threads";
import MessageBox from "@/components/MessageBox";
import Loading from "@/components/Loading";

import "./chat.css";
import useSSE from "../../hooks/useSSE";
import { ID, URL } from "../../strings";

export type UIMessage = {
  id: MessagePayload["user"]["id"];
  role: MessagePayload["user"]["role"];
  sentAt: MessagePayload["sentAt"];
  /** The full text, until now, of the message */
  text: string;
};
type MessageCache = { [userId: string]: { [contentId: string]: UIMessage } };

export default function Chat() {
  const [cache, setMessageCache] = useState<MessageCache>({});
  const [loading, setLoading] = useState(true);
  const [ids, setIds] = useState<string[]>([]);

  const [send] = useWebsocket(`ws://${URL}`, {
    onOpen: useCallback(() => setLoading(false), []),
    onMessage: useCallback((m) => setMessageCache(insertMessage(m)), []),
  });
  useSSE(`http://${URL}/streaming?id=${ID}`, {
    onMessage: useCallback((ids) => setIds(ids), []),
  });

  const messages = getMessages(cache);

  return (
    <div className="chat__wrapper">
      <Loading loading={loading}>
        <div className="chat__content">
          <Threads />
          <MessageBox messages={messages} send={send} ids={ids} />
        </div>
      </Loading>
    </div>
  );
}

/** Insert a message into the message cache */
const insertMessage =
  (message: MessagePayload) =>
  (cache: MessageCache): MessageCache => {
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

/** Get the messages from the message cache */
const getMessages = (cache: MessageCache): UIMessage[] =>
  Object.values(cache).flatMap((m) => Object.values(m));
