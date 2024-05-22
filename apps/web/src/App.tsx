import { useCallback, useState } from "react";

import Chat from "./components/Chat";
import Threads from "./components/Threads";

import "./App.css";
import useWebsocket from "./hooks/useWebsocket";
import { Message } from "./types";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const [send] = useWebsocket("ws://127.0.0.1:5001", {
    onOpen: () => setLoading(false),
    onMessage: (event) => {
      const message = event.data;
      if (message === "[START MESSAGE]") {
        setMessages((msgs) => [
          ...msgs,
          { role: "ai", content: "", sentAt: new Date() },
        ]);
      } else {
        setMessages((msgs) => {
          const lastIdx = msgs.length - 1;
          return msgs.with(lastIdx, {
            role: "ai",
            content: msgs[lastIdx].content + message,
          });
        });
      }
    },
  });

  const sendPrompt = useCallback(
    (prompt: string) => {
      setMessages([
        ...messages,
        { role: "user", content: prompt, sentAt: new Date() },
      ]);
      send?.(prompt);
    },
    [messages, send]
  );

  return (
    <div className="chat__wrapper">
      {loading ? (
        <div className="chat__spinner" />
      ) : (
        <div className="chat__content">
          <Threads />
          <Chat messages={messages} send={sendPrompt} />
        </div>
      )}
    </div>
  );
}
