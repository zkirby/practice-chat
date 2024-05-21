import { useEffect, useRef, useState } from "react";
import "./App.css";
import Chat from "./components/Chat";
import HeaderBar from "./components/HeaderBar";
import Threads from "./components/Threads";

function App() {
  const ws = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const messsageId = useRef(0);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:5001");

    // Connection opened
    socket.addEventListener("open", () => {
      setLoading(false);
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      const message = event.data;
      if (message === "[STOP MESSAGE]") {
        messsageId.current += 1;
      } else {
        const idx = messsageId.current;
        setMessages((msgs) => {
          if (idx >= msgs.length) return msgs.concat(message);
          return msgs.with(idx, msgs[idx] + message);
        });
      }
    });

    ws.current = socket;

    return () => ws.current?.close();
  }, []);

  const send = (prompt: string) => {
    setMessages([...messages, `>>> ${prompt}`]);
    messsageId.current += 1;
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
