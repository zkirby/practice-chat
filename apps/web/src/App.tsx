import { useEffect, useRef, useState } from "react";
import "./App.css";
import Chat from "./components/Chat";
import HeaderBar from "./components/HeaderBar";
import Threads from "./components/Threads";

function App() {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:5001");

    // Connection opened
    socket.addEventListener("open", () => {
      socket.send("Connection established");
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      setMessages((msgs) => [...msgs, event.data]);
    });

    ws.current = socket;

    return () => ws.current?.close();
  }, []);

  const send = (msg: string) => ws.current?.send(msg);

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
