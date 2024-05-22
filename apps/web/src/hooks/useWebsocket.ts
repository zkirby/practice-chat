import { useCallback, useEffect, useRef } from "react";

enum ReadyState {
  UNINSTANTIATED = -1,
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

type WebsocketMessage = string | ArrayBufferLike | Blob | ArrayBufferView;

export default function useWebsocket(
  path: `ws://${string}`,
  {
    onMessage,
    onOpen,
  }: { onMessage: (ev: MessageEvent<string>) => void; onOpen?: () => void }
): [WebSocket["send"] | undefined] {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(path);
    return () => ws.current?.close();
  }, []);

  useEffect(() => {
    if (!ws.current) return;

    if (onOpen) {
      ws.current.removeEventListener("open", onOpen);
      ws.current.addEventListener("open", onOpen);
    }
    ws.current.removeEventListener("message", onMessage);
    ws.current.addEventListener("message", onMessage);
  }, [onOpen, onMessage]);

  const send = useCallback((message: WebsocketMessage) => {
    if (ws.current?.readyState === ReadyState.OPEN) {
      ws.current.send(message);
    }
  }, []);

  return [send];
}
