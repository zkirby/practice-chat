import { useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";

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
  const [loading, setLoading] = useState(true);
  const [ids, setIds] = useState<string[]>([]);
  const user = useUser((u) => u.user);

  const { messages, setMessages } = useChatStore(
    useShallow((s) => ({ messages: s.get(), setMessages: s.add }))
  );

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
