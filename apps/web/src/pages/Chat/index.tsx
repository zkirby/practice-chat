import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useQuery } from "@tanstack/react-query";

import useWebsocket from "@/hooks/useWebsocket";
import Threads from "@/components/Threads";
import MessageBox from "@/components/MessageBox";
import Loading from "@/components/Loading";
import useSSE from "@/hooks/useSSE";
import { URL } from "@/strings";
import { useChatStore } from "./chat.model";
import { useUser } from "@/components/Authenticate/authenticate.model";

import "./chat.css";

export default function Chat() {
  const messagesQuery = useQuery({
    queryKey: ["/messages"],
    queryFn: () =>
      fetch(`http://${URL}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then((res) => res.json()),
  });

  const [loading, setLoading] = useState(true);
  const [ids, setIds] = useState<string[]>([]);
  const user = useUser((u) => u.user);

  const { messages, setMessages, setBulkMessages } = useChatStore(
    useShallow((s) => ({
      messages: s.get(),
      setMessages: s.add,
      setBulkMessages: s.addBulk,
    }))
  );

  useEffect(() => {
    if (messagesQuery.isFetched) {
      const formatted = messagesQuery.data.messages.map((m) => ({
        user: { id: m.userId, name: m.name },
        sentAt: m.sentAt,
        content: { text: m.text, id: m.id },
      }));
      setBulkMessages(formatted);
    }
  }, [messagesQuery.isFetched]);

  const [send] = useWebsocket(`ws://${URL}`, {
    onOpen: useCallback(() => setLoading(false), []),
    onMessage: useCallback((m) => setMessages(m), [setMessages]),
  });
  useSSE(`http://${URL}/streaming?id=${user?.id}`, {
    onMessage: useCallback((ids) => setIds(ids), []),
  });

  return (
    <div className="chat__wrapper">
      <Loading loading={loading}>
        <div className="chat__content">
          <Threads ids={ids} />
          <MessageBox messages={messages} send={send} />
        </div>
      </Loading>
    </div>
  );
}
