import { useEffect, useRef, useState } from "react";

import Chat from "./components/Chat";
import HeaderBar from "./components/HeaderBar";
import Threads from "./components/Threads";

import "./App.css";

function App() {
  const ws = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:5001");

    // Connection opened
    socket.addEventListener("open", () => {
      setLoading(false);
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      const message = event.data;
      if (message === "[START MESSAGE]") {
        setMessages((msgs) => [...msgs, { role: "ai", content: "" }]);
      } else {
        setMessages((msgs) => {
          const newMsgs = [...msgs];
          const lastMsg = newMsgs[newMsgs.length - 1];
          return newMsgs.with(newMsgs.length - 1, {
            role: "ai",
            content: lastMsg.content + message,
          });
        });
      }
    });

    ws.current = socket;

    return () => ws.current?.close();
  }, []);

  const send = (prompt: string) => {
    setMessages([...messages, { role: "user", content: prompt }]);
    ws.current?.send(prompt);
  };

  if (loading) return <div>loading...</div>;

  return (
    <div className="chat__wrapper">
      <HeaderBar />

      <div className="chat__content">
        <Threads />
        <Chat messages={messages} send={send} />
      </div>
    </div>
  );
}

export default App;
